import { postgresQuery } from "../db/postgres.js";
import { findAllPostsForFeedSQL } from "../db/queries/postsQueries.js";
import { findUsersInIds } from "../db/queries/userQueries.js";
import { uniq } from 'underscore';
import { userToResDto } from "./userMapper.js";
import { postToResDto } from "./postMapper.js";

export const feedToResDto = async feeds => {
    // isolate ids for each group
    const activeFriendsIds = uniq(feeds.map(feed => feed.userId));
    const postIds = uniq(feeds.map(feed => feed.content.postId));
    const commentsIds = feeds.map(feed => feed.content.commentId);
    const reactionsIds = feeds.map(feed => feed.content.reationId);

    // get info from db 
    const activeUserResults = await postgresQuery(findUsersInIds, [activeFriendsIds.toString()]);
    const postResults = await postgresQuery(findAllPostsForFeedSQL(postIds.toString()));
    // const commentResults = postgresQuery('', []);
    // const reactionResults = postgresQuery('', []);

    // map results into res dtos
    const users = activeUserResults.rows.map(user => userToResDto(user));
    const posts = postResults.rows.map(post => postToResDto(post));
    // const comments = commentResults.rows;
    // const reactions = reactionResults.rows;

    // return feed with information rfom each group
    return feeds.map(feed => ({
        type: feed.type,
        timestamp: feed.timestamp,
        user: users.find(user => user.id === feed.userId),
        post: posts.find(post => post.id === feed.content.postId),
        comment: posts.find(post => post.id === feed.content.commentId),
        reaction: posts.find(post => post.id === feed.content.reationId),
    }));
}