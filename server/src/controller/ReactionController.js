import { deleteReactoinByIdSQL, findReactionByCommentIdOnlySQL, findReactionByIdSQL, findReactionByPostIdOnlySQL, insertNewReactionSQL, updateReactionSQL } from '../db/queries/reactionsQueries.js';
import { detailedReactioToResDto, reactionAndUserResDto, reqDtoToReaction } from '../mapper/reactionMapper.js';
import { postgresQuery } from '../db/postgres.js';
import { deleteReactionFeed, insertNewFeedForReaction, updateReactionFeed } from '../db/repositories/FeedRepository.js';
import { asyncHandler } from '../common/utils.js';
import AppError from '../model/AppError.js';

const findAllPostReactions = asyncHandler(async (req, res, next) => {
    try {
        const reactions = await postgresQuery(findReactionByPostIdOnlySQL, [req.params.id, req.userId]);
        res.json(reactions.rows.map(row => reactionAndUserResDto(row)));
    } catch(e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const findAllCommentReactions = asyncHandler(async (req, res, next) => {
    try {
        const reactions = await postgresQuery(findReactionByCommentIdOnlySQL, [req.params.id, req.userId]);
        res.json(reactions.rows.map(row => reactionAndUserResDto(row)));
    } catch(e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const addNewReaction = asyncHandler(async (req, res, next) => {
    try {
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
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const updateReaction = asyncHandler(async (req, res, next) => {
    try {
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
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const deleteReaction = asyncHandler(async (req, res, next) => {
    try {
        // delete reaction from db
        const result = await postgresQuery(deleteReactoinByIdSQL, [req.params.id]);

        // delete reaction from feed
        await deleteReactionFeed(result.rows[0]);

        res.json(await detailedReactioToResDto(result.rows[0]));
    } catch(e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const viewReaction = asyncHandler(async (req, res, next) => {
    try {
        // delete reaction from db
        const result = await postgresQuery(findReactionByIdSQL, [req.params.id]);

        res.json(await detailedReactioToResDto(result.rows[0]));
    } catch(e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

export default {
    findAllPostReactions,
    findAllCommentReactions,
    addNewReaction,
    updateReaction,
    deleteReaction,
    viewReaction
}