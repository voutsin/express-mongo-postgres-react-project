import { postgresQuery } from "../db/postgres.js";
import { findAllPostsForFeedSQL } from "../db/queries/postsQueries.js";
import { findUsersInIds } from "../db/queries/userQueries.js";
import { uniq } from 'underscore';
import { userToResDto } from "./userMapper.js";
import { detailedPostToResDto, postToResDto, postWithoutCommentsResDto } from "./postMapper.js";
import { findReactionsInIds } from "../db/queries/reactionsQueries.js";
import { reactionToResDto } from "./reactionMapper.js";
import { findDeepComment } from "./utils.js";
import { findCommentsInIds } from "../db/queries/commentsQueries.js";
import { commentToResDto, commentWithReplyToResDto } from "./commentMapper.js";

export const feedToResDto = async feeds => {
    // isolate ids for each group
    const activeFriendsIds = uniq(feeds.filter(feed => feed.userId != null).map(feed => feed.userId));
    const postIds = uniq(feeds.filter(feed => feed.content.postId != null).map(feed => feed.content.postId));
    const reactionsIds = feeds.filter(feed => feed.content.reactionId != null).map(feed => feed.content.reactionId);

    // get info from db 
    const activeUserResults = activeFriendsIds.length > 0 ? await postgresQuery(findUsersInIds(activeFriendsIds.toString())) : null;
    const postResults = postIds.length > 0 ? await postgresQuery(findAllPostsForFeedSQL(postIds.toString())) : null;
    const reactionResults = reactionsIds.length > 0 ? await postgresQuery(findReactionsInIds(reactionsIds.toString())) : null;

    // map results into res dtos
    const users = activeUserResults ? activeUserResults.rows.map(user => userToResDto(user)) : [];
    const posts = postResults ? postResults.rows.map(post => postToResDto(post)) : [];
    const reactions = reactionResults ? reactionResults.rows.map(reaction => reactionToResDto(reaction)) : [];

    const mappedPosts = await Promise.all(posts.map(async post => await detailedPostToResDto(post)));

    // return feed with information rfom each group
    return feeds.map(feed => {
        const relatedPost = mappedPosts.find(post => post.id === feed.content.postId);
        const comment = relatedPost ? findDeepComment(relatedPost.comments, feed.content.commentId) : null;

        return {
            type: feed.type,
            timestamp: feed.timestamp,
            user: users.find(user => user.id === feed.userId),
            post: relatedPost,
            comment: comment || null,
            reaction: reactions.find(reaction => reaction.id === feed.content.reactionId),
        }
    });
}

export const feedByPostResDto = async feedRes => {
    // extract all feeds
    const feeds = [];
    feedRes.forEach(f => {
        feeds.push(...f.feeds);
    });

    // isolate ids for each group
    const activeFriendsIds = uniq(feeds.filter(feed => feed.userId != null).map(feed => feed.userId));
    const postIds = uniq(feeds.filter(feed => feed.content.postId != null).map(feed => feed.content.postId));

    // get info from db 
    const activeUserResults = activeFriendsIds.length > 0 ? await postgresQuery(findUsersInIds(activeFriendsIds.toString())) : null;
    const postResults = postIds.length > 0 ? await postgresQuery(findAllPostsForFeedSQL(postIds.toString())) : null;

    // map results into res dtos
    const users = activeUserResults ? activeUserResults.rows.map(user => userToResDto(user)) : [];
    const posts = postResults ? postResults.rows.map(post => postToResDto(post)) : [];

    const mappedPosts = await Promise.all(posts.map(async post => await postWithoutCommentsResDto(post)));

    // select top feeds from feed grouping
    const topFeeds = feedRes.map(f => findTopFeed(f.feeds));
    // find comments details for these feeds
    const commentIds = uniq(topFeeds.filter(tf => tf.content.commentId != null).map(tf => tf.content.commentId));
    const commentsResults = commentIds.length > 0 ? await postgresQuery(findCommentsInIds(commentIds.toString())) : null;
    const comments = commentsResults ? await Promise.all(commentsResults.rows.map(async c => await commentWithReplyToResDto(c))) : [];

    return feedRes.map(postFeed => {
        const topFeed = postFeed.feeds[0];

        return {
            count: postFeed.count,
            feeds: postFeed.feeds.map(f => ({
                ...f,
                content: {
                    postId: f.content.postId,
                    commentId: f.content.commentId,
                    isReply: f.content.isReply
                }
            })),
            topFeed: {
                ...topFeed,
                user: users.find(u => u.id === topFeed.userId),
                comment: topFeed.content.commentId ? comments.find(c => c.id === topFeed.content.commentId) : null,
            },
            users: uniq(postFeed.feeds.map(f => f.userId)).map(userId => users.find(u => u.id === userId)).filter(user => user != null),
            post: mappedPosts.find(post => post.id === postFeed.postId),
        }
    })
}

const findTopFeed = feeds => {
    return feeds[0];
}

export const feedToNotificationResDto = async notifications => {
    const activeFriendsIds = uniq(notifications.filter(feed => feed.userId != null).map(feed => feed.userId));
    const activeUserResults = activeFriendsIds.length > 0 ? await postgresQuery(findUsersInIds(activeFriendsIds.toString())) : null;
    const users = activeUserResults ? activeUserResults.rows.map(user => userToResDto(user)) : [];

    return notifications.map(notification => ({
        id: notification._id,
        user: users.find(u => u.id === notification.userId),
        type: notification.type,
        postId: notification.postId,
        commentId: notification.commentId,
        targetId: notification.targetId,
        timestamp: notification.timestamp,
        readBy: notification.readBy,
    }));
}