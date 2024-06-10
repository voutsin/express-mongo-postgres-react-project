import { postgresQuery } from "../db/postgres.js";
import { findAllPostsForFeedSQL } from "../db/queries/postsQueries.js";
import { findUsersInIds } from "../db/queries/userQueries.js";
import { uniq } from 'underscore';
import { userToResDto } from "./userMapper.js";
import { detailedPostToResDto } from "./postMapper.js";
import { commentToResDto } from "./commentMapper.js";
import { findCommentsInIds } from "../db/queries/commentsQueries.js";

export const feedToResDto = async feeds => {
    // isolate ids for each group
    const activeFriendsIds = uniq(feeds.filter(feed => feed.userId != null).map(feed => feed.userId));
    const postIds = uniq(feeds.filter(feed => feed.content.postId != null).map(feed => feed.content.postId));
    const commentsIds = feeds.filter(feed => feed.content.commentId != null).map(feed => feed.content.commentId);
    // TODO:
    // const reactionsIds = feeds.map(feed => feed.content.reationId);

    // get info from db 
    const activeUserResults = activeFriendsIds.length > 0 ? await postgresQuery(findUsersInIds, [activeFriendsIds.toString()]) : null;
    const postResults = postIds.length > 0 ? await postgresQuery(findAllPostsForFeedSQL(postIds.toString())) : null;
    const commentResults = commentsIds.length > 0 ? await postgresQuery(findCommentsInIds, [commentsIds.toString()]) : null;
    // TODO:
    // const reactionResults = postgresQuery('', [reactionsIds.toString()]);

    // map results into res dtos
    const users = activeUserResults ? activeUserResults.rows.map(user => userToResDto(user)) : [];
    const posts = postResults ?  await Promise.all(postResults.rows.map(async (post) => await detailedPostToResDto(post))) : [];
    const comments = commentResults ? commentResults.rows.map(post => commentToResDto(post)) : [];
    // TODO:
    // const reactions = reactionResults.rows;

    // return feed with information rfom each group
    return feeds.map(feed => ({
        type: feed.type,
        timestamp: feed.timestamp,
        user: users.find(user => user.id === feed.userId),
        post: posts.find(post => post.id === feed.content.postId),
        comment: comments.find(comment => comment.id === feed.content.commentId),
        // TODO:
        // reaction: reactions.find(reaction => reaction.id === feed.content.reationId),
    }));
}