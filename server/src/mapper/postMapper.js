import { findDetailedLists, findReactions, findUsers, mapComments, mapPosts } from "./utils.js";

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

// for feed or view
export const detailedPostToResDto = async post => {
    const lists = await findDetailedLists(post.id);
    const {
        posts
    } = lists;

    return posts.find(p => p.id === post.id) || null;
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

export const postForCommentResDto = (post, users) => {
    
}