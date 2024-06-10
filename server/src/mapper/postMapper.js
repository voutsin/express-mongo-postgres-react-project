import { postgresQuery } from "../db/postgres.js";
import { findCommentsByPostId } from "../db/queries/commentsQueries.js";
import { findUserById } from "../db/queries/userQueries.js";
import { commentToResDtoForPost } from "./commentMapper.js";
import { userToResDto } from "./userMapper.js";

export const postToResDto = post => {
    return {
        id: post.id,
        userId: post.user_id,
        content: post.content,
        mediaUrl: post.media_url,
        createdAt: post.created_at,
        postType: post.post_type,
    }
}

// for feed 
export const detailedPostToResDto = async post => {
    const userResults = await postgresQuery(findUserById, [post.user_id]);
    const commentResults = await postgresQuery(findCommentsByPostId, [post.id]);
    // TODO:
    // const reactionResults = await postgresQuery(findUserById, [post.user_id]);

    return {
        id: post.id,
        user: userResults ? userToResDto(userResults.rows[0]) || null : null,
        content: post.content,
        mediaUrl: post.media_url,
        createdAt: post.created_at,
        postType: post.post_type,
        comments:  await Promise.all(commentResults.rows.map(async comment => await commentToResDtoForPost(comment))),
        // TODO:
        // reactions: reactionResults.rows,
    }
}

export const postReqDtoToPost = req => {
    return {
        user_id: req.userId,
        content: req.content,
        media_url: req.mediaUrl,
        post_type: parseInt(req.postType),
    }
}

export const updatePostReqDtoToPost = req => {
    return {
        id: parseInt(req.id),
        content: req.content,
        media_url: req.mediaUrl,
        post_type: parseInt(req.postType),
    }
}