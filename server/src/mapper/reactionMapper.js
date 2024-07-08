import { postgresQuery } from "../db/postgres.js"
import { findCommentByIdSQL } from "../db/queries/commentsQueries.js"
import { findUserById } from "../db/queries/userQueries.js"
import { commentWithReplyToResDto } from "./commentMapper.js"
import { userToResDto } from "./userMapper.js"
import { findFeedDetails } from "./utils.js"

export const reactionToResDto = reaction => {
    return {
        id: reaction.id,
        userId: reaction.user_id,
        postId: reaction.post_id,
        commentId: reaction.comment_id,
        reactionType: parseInt(reaction.reaction_type),
        createdAt: reaction.created_at,
    }
}

export const reqDtoToReaction = req => {
    return {
        user_id: req.userId,
        post_id: req.postId,
        comment_id: req.commentId,
        reaction_type: parseInt(req.reactionType),
    }
}

export const detailedReactioToResDto = async reaction => {
    const lists = await findFeedDetails(reaction.post_id);
    const {
        users, posts
    } = lists;

    const commentResults = reaction.comment_id ? await postgresQuery(findCommentByIdSQL, [reaction.comment_id]) : null;
    const comments = commentResults ? await Promise.all(commentResults.rows.map(async c => await commentWithReplyToResDto(c))) : [];

    const foundUser = users.find(user => user.id === reaction.user_id) || null;
    const userResult = !foundUser ? await postgresQuery(findUserById, [reaction.user_id]) : null;
    const user = userResult ? userToResDto(userResult.rows[0]) : foundUser;

    return {
        ...reactionToResDto(reaction),
        user: user,
        post: posts.find(post => post.id === reaction.post_id),
        comment: comments.find(c => c.id === reaction.comment_id),
    }
}

export const reactionAndUserResDto = res => {
    const reaction = res.result;
    return {
        ...reactionToResDto(reaction),
        user: {
            ...userToResDto(reaction.user),
            isFriends: reaction.user.is_friends,
        },
    }
}