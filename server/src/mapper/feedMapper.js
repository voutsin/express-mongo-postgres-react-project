import { postgresQuery } from "../db/postgres.js";
import { findAllPostsForFeedSQL } from "../db/queries/postsQueries.js";
import { findUsersInIds } from "../db/queries/userQueries.js";
import { uniq } from 'underscore';
import { userToResDto } from "./userMapper.js";
import { detailedPostToResDto, postToResDto } from "./postMapper.js";
import { findReactionsInIds } from "../db/queries/reactionsQueries.js";
import { reactionToResDto } from "./reactionMapper.js";

export const feedToResDto = async feeds => {
    // isolate ids for each group
    const activeFriendsIds = uniq(feeds.filter(feed => feed.userId != null).map(feed => feed.userId));
    const postIds = uniq(feeds.filter(feed => feed.content.postId != null).map(feed => feed.content.postId));
    const reactionsIds = feeds.filter(feed => feed.content.reactionId != null).map(feed => feed.content.reactionId);
    // TODO: replies

    // get info from db 
    const activeUserResults = activeFriendsIds.length > 0 ? await postgresQuery(findUsersInIds(activeFriendsIds.toString())) : null;
    const postResults = postIds.length > 0 ? await postgresQuery(findAllPostsForFeedSQL(postIds.toString())) : null;
    const reactionResults = reactionsIds.length > 0 ? await postgresQuery(findReactionsInIds(reactionsIds.toString())) : null;
    // TODO: replies

    // map results into res dtos
    const users = activeUserResults ? activeUserResults.rows.map(user => userToResDto(user)) : [];
    const posts = postResults ? postResults.rows.map(post => postToResDto(post)) : [];
    const reactions = reactionResults ? reactionResults.rows.map(post => reactionToResDto(post)) : [];
    // TODO: replies

    const mappedPosts = await Promise.all(posts.map(async post => await detailedPostToResDto(post)));

    // return feed with information rfom each group
    return feeds.map(feed => {
        const relatedPost = mappedPosts.find(post => post.id === feed.content.postId);
        return {
            type: feed.type,
            timestamp: feed.timestamp,
            user: users.find(user => user.id === feed.userId),
            post: relatedPost,
            comment: relatedPost ? relatedPost.comments.find(comment => comment.id === feed.content.commentId) : null,
            reaction: reactions.find(reaction => reaction.id === feed.content.reactionId),
            // TODO: replies
        }
    });
}