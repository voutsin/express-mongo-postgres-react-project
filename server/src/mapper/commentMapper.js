import { postgresQuery } from "../db/postgres.js"
import { findPostByIdSQL } from "../db/queries/postsQueries.js";
import { findUserById } from "../db/queries/userQueries.js";
import { userToResDto } from "./userMapper.js";
import { uniq } from 'underscore';
import { findDetailedLists, findReactions, findUsers, mapComments, mapPosts } from "./utils.js";

export const commentToResDto = comment => {
    return {
        id: comment.id,
        postId: comment.post_id,
        userId: comment.user_id,
        content: comment.content,
        createdAt: comment.created_at,
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