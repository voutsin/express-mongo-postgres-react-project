import { validationResult } from 'express-validator';
import { postgresQuery } from '../db/postgres.js';
import { commentToResDto, detailedCommentToResDto, reqDtoToComment } from '../mapper/commentMapper.js';
import { addNewCommentSQL, deleteCommentSQL, findCommentByIdSQL, updateCommentSQL } from '../db/queries/commentsQueries.js';
import { deleteCommentFeed, insertOrUpdateCommentFeed, updateCommentFeed } from '../db/repositories/FeedRepository.js';
import { result } from 'underscore';

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

        res.json(result.rows.map(row => commentToResDto(row)));
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

        res.json(result.rows.map(row => commentToResDto(row)));
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

        // delete from comments table and return the last comment from user
        const results = await postgresQuery(deleteCommentSQL, [req.params.id]);

        if (!results) {
            throw new Error('Error deleting comment.')
        }
        
        // TODO: delete reactions

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

export default {
    findAllComments,
    addNewComment,
    updateComment,
    deleteComment,
    viewDetailedComment,
}