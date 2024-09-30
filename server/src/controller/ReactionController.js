import { deleteReactionByIdSQL, findReactionByCommentIdOnlySQL, findReactionByIdSQL, findReactionByPostIdOnlySQL, insertNewReactionSQL, updateReactionSQL } from '../db/queries/reactionsQueries.js';
import { detailedReactioToResDto, reactionAndUserResDto, reqDtoToReaction } from '../mapper/reactionMapper.js';
import { postgresQuery } from '../db/postgres.js';
import { deleteReactionFeed, insertNewFeedForReaction, updateReactionFeed } from '../db/repositories/FeedRepository.js';
import { asyncHandler } from '../common/utils.js';
import AppError from '../model/AppError.js';
import { deleteReactionNotification, insertReactionNotification } from '../db/repositories/NotificationRepository.js';
import { emitNotification } from '../socket/utils.js';
import { findCommentByIdSQL } from '../db/queries/commentsQueries.js';
import { findPostByIdSQL } from '../db/queries/postsQueries.js';

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

        // insert notification
        const notification = await insertReactionNotification(result.rows[0]);
        const newReaction = result.rows[0];
        await emitReactionNotification(notification, newReaction, next);

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
        const result = await postgresQuery(deleteReactionByIdSQL, [req.params.id]);

        // delete reaction from feed
        await deleteReactionFeed(result.rows[0]);

        // delete notification
        const deleteNotificationResult = await deleteReactionNotification(result.rows[0]);

        await emitDeleteReactionsNotification(deleteNotificationResult.foundIds, result.rows[0], next);

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

const emitReactionNotification = async (notification, reaction, next) => {
    try {
        const targetedUser = await extractUserFromReaction(reaction);
        if (targetedUser) {
            emitNotification(targetedUser, notification, 'send_notification');
        }
    } catch(e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
}

const emitDeleteReactionsNotification = async (idsToBeDeleted, reaction, next) => {
    try {
        // TODO: friends of targetUser that have notified should also delete their notifications
        const targetedUser = await extractUserFromReaction(reaction);
        if (targetedUser) {
            emitNotification(targetedUser, {idsToBeDeleted}, 'delete_notifications');
        }
    } catch(e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
}

const extractUserFromReaction = async reaction => {
    let targetedUser = null;
    if (reaction.comment_id) {
        const commentRes = await postgresQuery(findCommentByIdSQL, [reaction.comment_id]);
        targetedUser = commentRes && commentRes.rows[0] && commentRes.rows[0].user_id;
    } else if (reaction.post_id) {
        const postRes = await postgresQuery(findPostByIdSQL, [reaction.post_id]);
        targetedUser = postRes && postRes.rows[0] && postRes.rows[0].user_id;
    }
    return targetedUser;
}

export default {
    findAllPostReactions,
    findAllCommentReactions,
    addNewReaction,
    updateReaction,
    deleteReaction,
    viewReaction
}