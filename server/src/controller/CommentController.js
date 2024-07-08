import { validationResult } from 'express-validator';
import { postgresQuery } from '../db/postgres.js';
import { commentToResDto, commentWithReplyToResDto, detailedCommentToResDto, replyReqDtoToComment, reqDtoToComment } from '../mapper/commentMapper.js';
import { addNewCommentSQL, deleteCommentSQL, findCommentByIdSQL, insertNewReplySQL, updateCommentSQL } from '../db/queries/commentsQueries.js';
import { deleteCommentFeed, insertOrUpdateCommentFeed, updateCommentFeed } from '../db/repositories/FeedRepository.js';
import { deleteReactionsByCommentIdSQL } from '../db/queries/reactionsQueries.js';

const findAllComments = async (req, res) => {
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

const addNewComment = async (req, res) => {
    try {
        // check validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const finalBody = {
            ...req.body,
            userId: parseInt(req.userId),
        }

        const params = Object.values(reqDtoToComment(finalBody));
        const result = await postgresQuery(addNewCommentSQL, params);

        // add or update feed for comment
        await insertOrUpdateCommentFeed(result.rows[0]);

        res.json(await commentWithReplyToResDto(result.rows[0]));
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    } 
}

const updateComment = async (req, res) => {
    try {
        // check validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const finalBody = {
            content: req.body.content,
            id: parseInt(req.body.id),
        }

        const params = Object.values(finalBody);
        const result = await postgresQuery(updateCommentSQL, params);

        // update feed for comment
        await updateCommentFeed(result.rows[0]);

        res.json(await commentWithReplyToResDto(result.rows[0]));
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    } 
}

const deleteComment = async (req, res) => {
    try {
        // check validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // delete reactions
        await postgresQuery(deleteReactionsByCommentIdSQL, [req.params.id]);

        // delete from comments table and return the last comment from user
        const results = await postgresQuery(deleteCommentSQL, [req.params.id]);

        if (!results) {
            throw new Error('Error deleting comment.')
        }

        const lastComment = results.rows[0];
        // delete from feed
        await deleteCommentFeed(lastComment, req.params.id);

        res.json(lastComment ? commentToResDto(lastComment) : 'OK');

    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    } 
}

const viewDetailedComment = async (req, res) => {
    try {
        // check validations
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // fetch comment
        const results = await postgresQuery(findCommentByIdSQL, [req.params.id]);

        if (!results && results.rows.length === 0) {
            throw new Error('No comment found with this id');
        }

        res.json(await detailedCommentToResDto(results.rows[0]));
    } catch (e) {
        console.error(e);
        res.status(500).send('Internal Server Error: ', e);
    } 
}

const addReply = async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const commentResult = await postgresQuery(findCommentByIdSQL, [req.body.commentId]);
        const referenceComment = commentResult.rows[0];

        const finalBody = {
            ...req.body,
            userId: req.userId,
            postId: referenceComment.post_id,
        }
        const params = Object.values(replyReqDtoToComment(finalBody));
        const result = await postgresQuery(insertNewReplySQL, params)

        if(!result) {
            throw new Error('Something went wrong');
        }

        // add or update feed for reply comment
        const replyComment = {
            ...result.rows[0],
        }
        await insertOrUpdateCommentFeed(replyComment, true);

        res.status(200);
        res.json(await commentWithReplyToResDto(result.rows[0]));
    } catch(e) {
        console.log(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

export default {
    findAllComments,
    addNewComment,
    updateComment,
    deleteComment,
    viewDetailedComment,
    addReply,
}