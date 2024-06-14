import { findDetailedLists } from "./utils.js"

export const reactionToResDto = reaction => {
    return {
        id: reaction.id,
        userId: reaction.user_id,
        postId: reaction.post_id,
        commentId: reaction.comment_id,
        reactionType: reaction.reaction_type,
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
    const lists = await findDetailedLists(reaction.post_id);
    const {
        users, posts, comments
    } = lists;

    return {
        id: reaction.id,
        user: users.find(user => user.id === reaction.user_id),
        post: posts.find(post => post.id === reaction.post_id),
        comment: reaction.comment_id ? comments.find(comment => comment.id === reaction.comment_id) : null,
        reactionType: reaction.reaction_type,
        createdAt: reaction.created_at,
    }
}