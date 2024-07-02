import { validationResult } from 'express-validator';
import { deleteReactoinByIdSQL, findReactionByIdSQL, findReactionByPostIdOnlySQL, insertNewReactionSQL, updateReactionSQL } from '../db/queries/reactionsQueries.js';
import { detailedReactioToResDto, reactionAndUserResDto, reactionToResDto, reqDtoToReaction } from '../mapper/reactionMapper.js';
import { postgresQuery } from '../db/postgres.js';
import { deleteReactionFeed, insertNewFeedForReaction, updateReactionFeed } from '../db/repositories/FeedRepository.js';

const findAllPostReactions = async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
        const reactions = await postgresQuery(findReactionByPostIdOnlySQL, [req.params.id, req.userId]);
        res.json(reactions.rows.map(row => reactionAndUserResDto(row)));
    } catch(e) {
        console.log(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

const addNewReaction = async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const finalBody = {
            ...req.body,
            userId: parseInt(req.userId),
        }

        const params = Object.values(reqDtoToReaction(finalBody));
        const result = await postgresQuery(insertNewReactionSQL, params);

        // add feed for reaction
        await insertNewFeedForReaction(result.rows[0]);

        res.json(await detailedReactioToResDto(result.rows[0]));
    } catch(e) {
        console.log(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

const updateReaction = async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const finalBody = {
            id: req.body.id,
            reaction_type: parseInt(req.body.reactionType),
        }

        const params = Object.values(finalBody);
        const result = await postgresQuery(updateReactionSQL, params);

        // update feed for reaction
        await updateReactionFeed(result.rows[0]);

        res.json(await detailedReactioToResDto(result.rows[0]));
    } catch(e) {
        console.log(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

const deleteReaction = async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // delete reaction from db
        const result = await postgresQuery(deleteReactoinByIdSQL, [req.params.id]);

        // delete reaction from feed
        await deleteReactionFeed(result.rows[0]);

        res.json(await detailedReactioToResDto(result.rows[0]));
    } catch(e) {
        console.log(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

const viewReaction = async (req, res) => {
    try {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // delete reaction from db
        const result = await postgresQuery(findReactionByIdSQL, [req.params.id]);

        res.json(await detailedReactioToResDto(result.rows[0]));
    } catch(e) {
        console.log(e);
        res.status(500).send('Internal Server Error: ', e);
    }
}

export default {
    findAllPostReactions,
    addNewReaction,
    updateReaction,
    deleteReaction,
    viewReaction
}