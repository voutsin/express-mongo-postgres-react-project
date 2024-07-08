import { postgresQuery } from "../db/postgres.js";
import { findCommentAndUserByIdSQL, findCommentRepliesSQL } from "../db/queries/commentsQueries.js";
import { findReactionAndUserByCommentIdsSQL } from "../db/queries/reactionsQueries.js";
import { findUserById } from "../db/queries/userQueries.js";
import { reactionAndUserResDto } from "./reactionMapper.js";
import { userToResDto } from "./userMapper.js";
import { findDetailedLists } from "./utils.js";

export const commentToResDto = comment => {
    return {
        id: comment.id,
        postId: comment.post_id,
        userId: comment.user_id,
        content: comment.content,
        createdAt: comment.created_at,
        isReply: Boolean(comment.is_reply),
        replyCommentId: comment.reply_comment_id
    }
}

// for view
export const detailedCommentToResDto = async comment => {
    const lists = await findDetailedLists(comment.post_id);
    const {
        users, posts, reactions
    } = lists;

    return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        // find post with comments and reactions
        post: posts[0],
        // find comment user
        user: users.find(user => user.id === comment.user_id) || null,
        // add reactions
        reactions: reactions.filter(reaction => reaction.commentId === comment.id),
    }
}

export const reqDtoToComment = req => {
    return {
        post_id: req.postId,
        user_id: req.userId,
        content: req.content,
    }
}

export const replyReqDtoToComment = req => {
    return {
        post_id: parseInt(req.postId),
        user_id: parseInt(req.userId),
        content: req.content, 
        is_reply: 1, 
        reply_comment_id: parseInt(req.commentId),
    }
}

export const commentWithReplyToResDto = async comment => {
    let reply = null;
    const commentIds = [comment.id];
    if (comment.reply_comment_id != null) {
        const replyResults = await postgresQuery(findCommentAndUserByIdSQL, [comment.reply_comment_id]);
        reply = replyResults ? replyResults.rows[0].result : null;
        commentIds.push(reply.id);
    }

    const reactionResults = await postgresQuery(findReactionAndUserByCommentIdsSQL(commentIds.toString()));
    const reactions = reactionResults ? reactionResults.rows.map(reaction => reactionAndUserResDto(reaction)) : [];

    const userResult = await postgresQuery(findUserById, [comment.user_id]);
    const user = userResult ? userToResDto(userResult.rows[0]) : null;

    return {
        ...commentToResDto(comment),
        user: user,
        replyComment: reply ? {
            ...commentToResDto(reply),
            user: userToResDto(reply.user),
            reactions: reactions.filter(re => re.commentId === reply.id) || [],
        } : null,
        reactions: reactions.filter(re => re.commentId === comment.id) || [],
    }
}
