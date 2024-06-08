
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