import { unlink, access, constants } from 'fs';
import { postgresQuery } from '../db/postgres.js';
import { createNewPostSQL, deletePostSQL, findAllPostsByUserIdSQL, findAllPostsSQL, findPostByIdSQL, findPostsCountByUserIdSQL, updatePostSQL } from '../db/queries/postsQueries.js';
import { detailedPostToResDto, postReqDtoToPost, postToResDto, postWithUserResDto, updatePostReqDtoToPost } from '../mapper/postMapper.js';
import { PostType } from '../common/enums.js';
import { addNewPostValidations, updatePostValidations } from '../validators/postValidator.js';
import { deleteFeedByPostId, insertNewFeedForPost } from '../db/repositories/FeedRepository.js';
import { deleteCommentsByPostId } from '../db/queries/commentsQueries.js';
import { deleteReactionsByPostIdSQL } from '../db/queries/reactionsQueries.js';
import { omit } from 'underscore';
import { asyncHandler, getThumbnailUrl, MEDIA_THUMBNAIL_PREFIX } from '../common/utils.js';
import AppError from '../model/AppError.js';

const findAllPosts = asyncHandler(async (req, res, next) => {
    try {
        const result = await postgresQuery(findAllPostsSQL);
        res.json(result.rows.map(row => postToResDto(row)));
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
})

const findPostById = asyncHandler(async (req, res, next) => {
    try {
        const params = Object.values(req.params);
        const result = await postgresQuery(findPostByIdSQL, params);
        res.json( await Promise.all(result.rows.map(async row => await detailedPostToResDto(row))));
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

// TODO: add pages to endpoint
const findAllUserPosts = asyncHandler(async (req, res, next) => {
    try {
        const userId = parseInt(req.query.id);
        const page = parseInt(req.query.page) || 1; // default to page 1 if not provided
        const pageSize = parseInt(req.query.pageSize) || 10; // default to 10 items per page if not provided
        const skip = (page - 1) * pageSize;

        const totalCountResult = await postgresQuery(findPostsCountByUserIdSQL, [userId]);
        const totalCount = parseInt(totalCountResult.rows[0].count, 10);

        const result = await postgresQuery(findAllPostsByUserIdSQL, [userId, pageSize, skip]);
        const posts = await Promise.all(result.rows.map(async row => await detailedPostToResDto(row)));

        res.json({
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage: page,
            posts
        });
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const addNewPost = asyncHandler(async (req, res, next) => {
    try {
        const body = Object.assign({}, req.body);
        
        // check validations
        const errors = addNewPostValidations(req);
        if (!errors.result) {
            // If there are validation errors, respond with errors and delete the uploaded file
            if (req.file) {
              // Optionally, delete the uploaded file if validation fails
              const mediaThumbnailUrl = getThumbnailUrl(null, req.file.path, false);
              unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete file:', err);
              });
              unlink(mediaThumbnailUrl, (err) => {
                if (err) console.error('Failed to delete thumbnail file:', err);
              });
            }
          next(new AppError(errors.message, 400));
        }

        body.postType = parseInt(body.postType);

        const mediaPath = req.file ? req.file.path : null;
        if (!mediaPath && body.postType === PostType.MULTIMEDIA) {
          next(new AppError('No media uploaded', 400));
        }

        const finalBody = {
            ...body,
            userId: parseInt(req.userId),
            mediaUrl: body.postType === PostType.MULTIMEDIA ? mediaPath : null,
        }

        const params = Object.values(postReqDtoToPost(finalBody));
        const result = await postgresQuery(createNewPostSQL, params);

        // add to feed
        const postFeed = await insertNewFeedForPost(result.rows[0], req.userId);
        const postResDto = await postWithUserResDto(result.rows[0]);

        res.json({
          post: {
            ...postResDto,
            comments: [],
            reactions: [],
            reactionsNumber: {total: 0},
            commentsNumber: 0,
          },
          feed: {
            ...omit(postFeed._doc, '__v', '_id'),
            user: postResDto.user,
          },
        });
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const updatePost = asyncHandler(async (req, res, next) => {
    try {
        const body = Object.assign({}, req.body);

        // check validations
        const errors = await updatePostValidations(req);
        if (!errors.result) {
            // If there are validation errors, respond with errors and delete the uploaded file
            if (req.file) {
              // Optionally, delete the uploaded file if validation fails
              const mediaThumbnailUrl = getThumbnailUrl(null, req.file.path, false);
              unlink(req.file.path, (err) => {
                if (err) console.error('Failed to delete file:', err);
              });
              unlink(mediaThumbnailUrl, (err) => {
                if (err) console.error('Failed to delete thumbnail file:', err);
              });
            }
            next(new AppError(errors.message, 400));
        }

        const oldPostResult = await postgresQuery(findPostByIdSQL, [body.id]);
        const oldPost = oldPostResult ? oldPostResult.rows[0] : null;

        body.postType = parseInt(body.postType);

        const mediaPath = req.file ? req.file.path : null;
        if (!mediaPath && body.postType === PostType.MULTIMEDIA) {
          next(new AppError('No media uploaded', 400));
        }

        const finalBody = {
            ...body,
            mediaUrl: body.postType === PostType.MULTIMEDIA ? mediaPath : null,
        }

        const params = Object.values(updatePostReqDtoToPost(finalBody));
        const result = await postgresQuery(updatePostSQL, params);

        if (result && oldPost) {
          deleteFileFromDirectory(oldPost.media_url, next);
        }

        res.json(postToResDto(result.rows[0]));
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const deletePost = asyncHandler(async (req, res, next) => {
    try {
        const params = Object.values(req.params);

        // delete reactions by postId
        await postgresQuery(deleteReactionsByPostIdSQL, [req.params.id]);

        // delete comments by postId
        await postgresQuery(deleteCommentsByPostId, [req.params.id]);

        // delete post
        const result = await postgresQuery(deletePostSQL, params);

        if (result) {
            const deletedPost = result.rows[0];

            // delete from feed
            await deleteFeedByPostId(deletedPost.id);
            
            // delete files associated with the post if present
            deleteFileFromDirectory(deletedPost.media_url, next);
        }
        res.json(postToResDto(result.rows[0]));
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const deleteFileFromDirectory = (filePath, next) => {
  // delete old media if new exist
  if (filePath) {
    const mediaThumbnailUrl = getThumbnailUrl(null, filePath, false);
    unlink(filePath, (err) => {
      if (err) console.error('Failed to delete file:', err);
    });
    unlink(mediaThumbnailUrl, (err) => {
      if (err) console.error('Failed to delete thumbnail file:', err);
    });
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