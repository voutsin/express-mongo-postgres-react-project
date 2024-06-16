import { postgresQuery } from "../db/postgres.js"
import { findPostByIdSQL } from "../db/queries/postsQueries.js";
import { commentToResDto } from "./commentMapper.js";
import { postToResDto } from "./postMapper.js";
import { reactionToResDto } from "./reactionMapper.js";
import { userToResDto } from "./userMapper.js";
import { uniq } from 'underscore';

export const findDetailedLists = async (postId) => {
    // queries
    const postResults = await postgresQuery(findPostByIdSQL, [postId]);
    const allPosts = [...postResults.rows];
    const commentParams = uniq(allPosts.map(post => post.id)).toString();
    const commentResults = commentParams.length > 0 ? await postgresQuery(`SELECT * FROM comments WHERE post_id IN (${commentParams});`) : {rows: []}; // TODO: join with replies to get all comment replies
    // TODO: maybe map replies here...
    const allComments = [...commentResults.rows];
    const reactionResults = await findReactions(allPosts, allComments);
    const userResults = await findUsers(allPosts, allComments, reactionResults.rows);

    // lists
    const users = userResults.map(user => userToResDto(user));
    const reactions = reactionResults.map(reaction => ({
            ...reaction,
            user: users.find(user => user.id === reaction.userId)
        }));
    const comments = mapComments(allComments, users, reactions);
    const posts = mapPosts(allPosts, users, comments, reactions);

    return {
        users, posts, comments, reactions
    }
}

export const findReactions = async (posts = [], comments = []) => {
    const postParams = uniq(posts.map(post => post.id)).toString();
    const postsReactionsRes = await postgresQuery(`SELECT * FROM reactions WHERE post_id IN (${postParams}) AND comment_id IS NULL;`);

    const commentParams = uniq(comments.map(comment => comment.id)).toString();
    const commentsReactionsRes = commentParams.length > 0 ? await postgresQuery(`SELECT * FROM reactions WHERE comment_id IN (${commentParams});`) : {rows: []};

    const reactions = uniq([
        ...postsReactionsRes.rows,
        ...commentsReactionsRes.rows,
    ]);

    return reactions ? reactions.map(reaction => reactionToResDto(reaction)) : [];
}

export const findUsers = async (posts = [], comments = [], reactions = []) => {
    const postUserIds = posts.map(post => post.user_id || post.userId);
    const commentsUserIds = comments.map(comment => comment.user_id || comment.userId);
    const reactionsUserIds = reactions.map(reaction => reaction.user_id || reaction.userId);

    const userIds = uniq([
        ...postUserIds,
        ...commentsUserIds,
        ...reactionsUserIds,
    ]).toString();

    const userResults = await postgresQuery(`SELECT * FROM users WHERE id IN (${userIds});`);
    return userResults ? userResults.rows : [];
}

export const mapComments = (commentResults = [], users = [], reactions = []) => {
    return commentResults
        .map(com => commentToResDto(com))
        .map(com => ({
            ...com,
            user: users.find(user => user.id === com.userId),
            reactions: reactions.filter(reaction => reaction.commentId === com.id),
            // TODO: replies
        }));
}

// TODO: map replies -> get all replies of comment and fill info (reaction etc)

export const mapPosts = (postResults = [], users = [], comments = [], reactions = []) => {
    return postResults ? postResults
    .map(post => postToResDto(post))
    .map(post => ({
        ...post,
        user: users.find(user => user.id === post.userId),
        comments: comments.filter(comment => comment.postId === post.id),
        reactions: reactions.filter(reaction => reaction.postId === post.id && reaction.commentId == null), // reactions with this post id and is for post only
    })) : []
}