import { postgresQuery } from '../db/postgres.js';
import { commentToResDto, commentWithReactionsToResDto, commentWithReplyToResDto, detailedCommentToResDto, replyReqDtoToComment, reqDtoToComment } from '../mapper/commentMapper.js';
import { addNewCommentSQL, deleteCommentSQL, findCommentByIdSQL, findCommentRepliesSQL, findSingleCommentsByPostId, insertNewReplySQL, selectCountOfCommentsSQL, selectCountOfRepliesSQL, updateCommentSQL } from '../db/queries/commentsQueries.js';
import { deleteCommentFeed, insertOrUpdateCommentFeed, updateCommentFeed } from '../db/repositories/FeedRepository.js';
import { deleteReactionsByCommentIdSQL } from '../db/queries/reactionsQueries.js';
import { asyncHandler } from '../common/utils.js';
import { deleteCommentNotification, insertCommentNotification } from '../db/repositories/NotificationRepository.js';
import AppError from '../model/AppError.js';
import { emitNotification } from '../socket/utils.js';
import { findPostByIdSQL } from '../db/queries/postsQueries.js';

const findAllPostComments = asyncHandler(async (req, res, next) => {
    try {
        const postId = req.query.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Total count of comments
        const totalCountResult = await postgresQuery(selectCountOfCommentsSQL, [postId]);
        const totalCount = parseInt(totalCountResult.rows[0].count, 10);

        const result = await postgresQuery(findSingleCommentsByPostId, [postId, limit, offset]);
        
        // Pagination metadata
        res.json({
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            comments: await commentWithReactionsToResDto(result.rows)
        });
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const findAllCommentReplies = asyncHandler(async (req, res, next) => {
    try {
        const commentId = req.query.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // Total count of comments
        const totalCountResult = await postgresQuery(selectCountOfRepliesSQL, [commentId]);
        const totalCount = parseInt(totalCountResult.rows[0].count, 10);

        const result = await postgresQuery(findCommentRepliesSQL, [commentId, limit, offset]);
        
        // Pagination metadata
        res.json({
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            replies: await commentWithReactionsToResDto(result.rows)
        });
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const addNewComment = asyncHandler(async (req, res, next) => {
    try {
        const finalBody = {
            ...req.body,
            userId: parseInt(req.userId),
        }

        const params = Object.values(reqDtoToComment(finalBody));
        const result = await postgresQuery(addNewCommentSQL, params);

        // add or update feed for comment
        await insertOrUpdateCommentFeed(result.rows[0]);

        // insert notification
        const notification = await insertCommentNotification(result.rows[0]);
        const newComment = result.rows[0];
        await emitCommentNotification(notification, newComment, next);

        res.json(await commentWithReplyToResDto(result.rows[0]));
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    } 
});

const updateComment = asyncHandler(async (req, res, next) => {
    try {
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
        next(new AppError('Internal Server Error: ' + e, 500));
    } 
});

const deleteComment = asyncHandler(async (req, res, next) => {
    try {
        const oldComment = await postgresQuery(findCommentByIdSQL, [req.params.id]);
        // delete reactions
        await postgresQuery(deleteReactionsByCommentIdSQL, [req.params.id]);

        // delete from comments table and return the last comment from user
        const results = await postgresQuery(deleteCommentSQL, [req.params.id]);

        if (!results) {
            next(new AppError('Error deleting comment.', 400));
        }

        const lastComment = results.rows[0];
        // delete from feed
        await deleteCommentFeed(lastComment, req.params.id);

        // delete notifications
        const deleteNotificationResult = await deleteCommentNotification(oldComment.rows[0]);

        await emitDeleteCommentNotification(deleteNotificationResult.foundIds, oldComment.rows[0], next);

        res.json(lastComment ? commentToResDto(lastComment) : 'OK');

    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    } 
});

const viewDetailedComment = asyncHandler(async (req, res, next) => {
    try {
        // fetch comment
        const results = await postgresQuery(findCommentByIdSQL, [req.params.id]);

        if (!results && results.rows.length === 0) {
            next(new AppError('No comment found with this id.', 400));
        }

        res.json(await detailedCommentToResDto(results.rows[0]));
    } catch (e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    } 
});

const addReply = asyncHandler(async (req, res, next) => {
    try {
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
            next(new AppError('Something went wrong.', 400));
        }

        // add or update feed for reply comment
        const replyComment = {
            ...result.rows[0],
        }
        await insertOrUpdateCommentFeed(replyComment, true);

        // insert notification
        const notification = await insertCommentNotification(replyComment);
        await emitCommentNotification(notification, replyComment, next);

        res.status(200);
        res.json(await commentWithReplyToResDto(result.rows[0]));
    } catch(e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
});

const emitCommentNotification = async (notification, comment, next) => {
    try {
        const targetedUser = await extractUserFromComment(comment);
        if (targetedUser) {
            emitNotification(targetedUser, notification, 'send_notification');
        }
    } catch(e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
}

const emitDeleteCommentNotification = async (idsToBeDeleted, comment, next) => {
    try {
        const targetedUser = await extractUserFromComment(comment);
        if (targetedUser) {
            emitNotification(targetedUser, {idsToBeDeleted}, 'delete_notifications');
        }
    } catch(e) {
        next(new AppError('Internal Server Error: ' + e, 500));
    }
}

const extractUserFromComment = async comment => {
    let targetedUser = null;
    if (comment.is_reply) {
        const commentRes = await postgresQuery(findCommentByIdSQL, [comment.reply_comment_id]);
        targetedUser = commentRes && commentRes.rows[0] && commentRes.rows[0].user_id;
    } else {
        const postRes = await postgresQuery(findPostByIdSQL, [comment.post_id]);
        targetedUser = postRes && postRes.rows[0] && postRes.rows[0].user_id;
    }
    return targetedUser;
}

export default {
    findAllPostComments,
    findAllCommentReplies,
    addNewComment,
    updateComment,
    deleteComment,
    viewDetailedComment,
    addReply,
}