import { validationResult } from 'express-validator';
import { unlink, access, constants } from 'fs';
import { postgresQuery } from '../db/postgres.js';
import { createNewPostSQL, deletePostSQL, findAllPostsByUserIdSQL, findAllPostsSQL, findPostByIdSQL, updatePostSQL } from '../db/queries/postsQueries.js';
import { detailedPostToResDto, postReqDtoToPost, postToResDto, updatePostReqDtoToPost } from '../mapper/postMapper.js';
import { PostType } from '../common/enums.js';
import { addNewPostValidations, updatePostValidations } from '../validators/postValidator.js';
import { deleteFeedByPostId, insertNewFeedForPost } from '../db/repositories/FeedRepository.js';
import { deleteCommentsByPostId } from '../db/queries/commentsQueries.js';

const findAllPosts = async (req, res) => {
    try {
        // check validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const result = await postgresQuery(findAllPostsSQL);
        res.json(result.rows.map(row => postToResDto(row)));
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

const findPostById = async (req, res) => {
    try {
        // check validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const params = Object.values(req.params);
        const result = await postgresQuery(findPostByIdSQL, params);
        res.json( await Promise.all(result.rows.map(async row => await detailedPostToResDto(row))));
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

const findAllUserPosts = async (req, res) => {
    try {
        // check validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const params = Object.values(req.params);
        const result = await postgresQuery(findAllPostsByUserIdSQL, params);
        res.json(result.rows.map(row => postToResDto(row)));
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

const addNewPost = async (req, res) => {
    try {
        const body = Object.assign({}, req.body);
        
        // check validations
        const errors = addNewPostValidations(req);
        if (!errors.result) {
            // If there are validation errors, respond with errors and delete the uploaded file
            if (req.file) {
              // Optionally, delete the uploaded file if validation fails
              unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete file:', err);
              });
            }
          return res.status(400).send(errors.message);
        }

        body.postType = parseInt(body.postType);

        const mediaPath = req.file ? req.file.path : null;
        if (!mediaPath && body.postType === PostType.MULTIMEDIA) {
          return res.status(400).json({ error: 'No media uploaded' });
        }

        const finalBody = {
            ...body,
            userId: parseInt(req.userId),
            mediaUrl: body.postType === PostType.MULTIMEDIA ? mediaPath : null,
        }

        const params = Object.values(postReqDtoToPost(finalBody));
        const result = await postgresQuery(createNewPostSQL, params);

        // add to feed
        await insertNewFeedForPost(result.rows[0], req.userId);

        res.json(result.rows.map(row => postToResDto(row)));
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

const updatePost = async (req, res) => {
    try {
        const body = Object.assign({}, req.body);

        // check validations
        const errors = await updatePostValidations(req);
        if (!errors.result) {
            // If there are validation errors, respond with errors and delete the uploaded file
            if (req.file) {
              // Optionally, delete the uploaded file if validation fails
              unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete file:', err);
              });
            }
            return res.status(400).send(errors.message);
        }

        body.postType = parseInt(body.postType);

        const mediaPath = req.file ? req.file.path : null;
        if (!mediaPath && body.postType === PostType.MULTIMEDIA) {
          return res.status(400).json({ error: 'No media uploaded' });
        }

        const finalBody = {
            ...body,
            mediaUrl: body.postType === PostType.MULTIMEDIA ? mediaPath : null,
        }

        const params = Object.values(updatePostReqDtoToPost(finalBody));
        const result = await postgresQuery(updatePostSQL, params);
        res.json(result.rows.map(row => postToResDto(row)));
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

const deletePost = async (req, res) => {
    try {
        // check validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const params = Object.values(req.params);

        // delete comments by postId
        await postgresQuery(deleteCommentsByPostId, [req.params.id]);

        // TODO: delete reactions by postId

        // delete post
        const result = await postgresQuery(deletePostSQL, params);

        if (result) {
            const deletedPost = result.rows[0];

            // delete from feed
            await deleteFeedByPostId(deletedPost.id);
            
            // delete files associated with the post if present
            const filePath = deletedPost.media_url;

            filePath && access(filePath, constants.F_OK, (err) => {
                if (err) {
                  return res.status(404).send('File not found');
                }
            
                // File exists, delete it
                unlink(filePath, (err) => {
                  if (err) {
                    return res.status(500).send('Error deleting the file');
                  }
                });
            });
        }
        res.json(result.rows.map(row => postToResDto(row)));
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

export default {
    findAllPosts,
    findPostById,
    findAllUserPosts,
    addNewPost,
    updatePost,
    deletePost,
}