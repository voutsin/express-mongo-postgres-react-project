import { postgresQuery } from "../db/postgres.js"
import { findPostByIdSQL } from "../db/queries/postsQueries.js";
import { findUserById } from "../db/queries/userQueries.js";
import { detailedPostToResDto } from "./postMapper.js";
import { userToResDto } from "./userMapper.js";

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
    const userResults = await postgresQuery(findUserById, [comment.user_id]);
    const postResults = await postgresQuery(findPostByIdSQL, [comment.post_id]);
    // TODO: add reactions
    // const reactionResults = await postgresQuery('', [comment.id]);
    return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        post: postResults ? await detailedPostToResDto(postResults.rows[0]) || null : null,
        user: userResults ? userToResDto(userResults.rows[0]) || null : null,
        // TODO:
        // reactions: reactionResults ? userToResDto(reactionResults.rows) || [] : [],
    }
}

// for post
export const commentToResDtoForPost = async comment => {
    const userResults = await postgresQuery(findUserById, [comment.user_id]);
    // TODO: add reactions
    // const reactionResults = await postgresQuery('', [comment.id]);
    return {
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at,
        postId: comment.post_id,
        user: userResults ? userToResDto(userResults.rows[0]) || null : null,
        // TODO:
        // reactions: reactionResults ? userToResDto(reactionResults.rows) || [] : [],
    }
}

export const reqDtoToComment = req => {
    return {
        post_id: req.postId,
        user_id: req.userId,
        content: req.content,
    }
}