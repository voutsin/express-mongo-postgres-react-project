import { NotificationTypes } from "../../common/enums.js";
import Notification from "../../model/Notification.js";
import { postgresQuery } from "../postgres.js";
import { findAllCommentsByUserId } from "../queries/commentsQueries.js";
import { findAllActiveFriendshipsByUserId } from "../queries/friendsQueries.js";
import { findAllUserPostIdsSQL } from "../queries/postsQueries.js";

export const insertFriendshipNotification = async (currentUserId, friendId) => {
    try {
        const query = { 
            userId: Number(currentUserId), 
            targetId: Number(friendId),
            type: { $in: [NotificationTypes.ACCEPT_FRIEND_REQUEST, NotificationTypes.SEND_FRIEND_REQUEST] },
        };
        const alreadyNotification = await Notification.find(query);

        if (alreadyNotification.length > 0) {
            return null;
        }

        const insert = { 
            userId: parseInt(currentUserId), 
            type: NotificationTypes.SEND_FRIEND_REQUEST, 
            targetId: friendId,
            readBy: [parseInt(currentUserId)],
        };
    
        // Create a new feed entry
        const newNotification = new Notification(insert);
    
        // Save the entry to the database
        return await newNotification.save();
    } catch(e) {
        console.log("insertFriendshipNotification error: ", e);
        throw new Error(e);
    }
}

export const acceptFriendshipNotification = async (currentUserId, friendId) => {
    try {
        const query = { 
            userId: Number(friendId), 
            targetId: Number(currentUserId),
            type: NotificationTypes.SEND_FRIEND_REQUEST,
        };
        const sendRequestNotification = await Notification.find(query);

        if (sendRequestNotification.length > 0) {
            const insert = { 
                userId: parseInt(currentUserId), 
                type: NotificationTypes.ACCEPT_FRIEND_REQUEST, 
                targetId: friendId,
                readBy: [parseInt(currentUserId)],
            };
        
            // Create a new feed entry
            const newNotification = new Notification(insert);
        
            // Save the entry to the database
            return await newNotification.save();
        }

        return null;
    } catch(e) {
        console.log("acceptFriendshipNotification error: ", e);
        throw new Error(e);
    }
}

export const deleteFriendshipNotification = async (currentUserId, friendId) => {
    try {
        // delete where userId = currentUserId and 
        const query = {
            $or: [
                { 
                    $and: [
                        { userId: currentUserId },
                        { targetId: friendId }
                    ]
                },
                { 
                    $and: [
                        { userId: friendId },
                        { targetId: currentUserId }
                    ]
                }
            ],
            type: { $in: [NotificationTypes.ACCEPT_FRIEND_REQUEST, NotificationTypes.SEND_FRIEND_REQUEST] },
        };

        const foundIds = await Notification.find(query, '_id');
        const result = await Notification.deleteMany(query);
        
        return {
            ...result,
            foundIds,
        };
    } catch (e) {
        console.log("deleteFriendshipNotification error: ", e);
        throw new Error(e);
    }
}

export const insertCommentNotification = async (newComment) => {
    try {
        const {
            user_id,
            post_id,
            id,
            is_reply,
            reply_comment_id
        } = newComment;

        const query = { 
            userId: Number(user_id), 
            postId: Number(post_id),
            commentId: is_reply ? reply_comment_id : null,
            targetId: Number(id),
            type: is_reply ? NotificationTypes.REPLY_TO_COMMENT : NotificationTypes.COMMENT_TO_POST,
        };
        const alreadyNotification = await Notification.find(query);

        if (alreadyNotification.length > 0) {
            return null;
        }

        const insert = { 
            userId: parseInt(user_id), 
            postId: parseInt(post_id),
            commentId: is_reply ? reply_comment_id : null,
            targetId: parseInt(id),
            type: is_reply ? NotificationTypes.REPLY_TO_COMMENT : NotificationTypes.COMMENT_TO_POST,
            readBy: [parseInt(user_id)],
        };
    
        // Create a new feed entry
        const newNotification = new Notification(insert);
    
        // Save the entry to the database
        return await newNotification.save();
    } catch (e) {
        console.log("insertCommentNotification error: ", e);
        throw new Error(e);
    }
}

export const deleteCommentNotification = async oldComment => {
    try {
        const {
            id,
            user_id,
            post_id,
            reply_comment_id
        } = oldComment;

        const query = {
            $or: [
                { 
                    // comment 
                    $and: [
                        { userId: user_id },
                        { postId: post_id },
                        { targetId: id },
                        { type: NotificationTypes.COMMENT_TO_POST }
                    ]
                },
                { 
                    // comment is reply
                    $and: [
                        { userId: user_id },
                        { commentId: reply_comment_id },
                        { targetId: id }, 
                        { type: NotificationTypes.REPLY_TO_COMMENT }
                    ]
                },
                { 
                    // comment reactions
                    $and: [
                        { postId: post_id },
                        { commentId: id },
                        { type: NotificationTypes.REACTION_TO_COMMENT }
                    ]
                },
            ],
        };

        const foundIds = await Notification.find(query, '_id');
        const result = await Notification.deleteMany(query);
        
        return {
            ...result,
            foundIds,
        };
    } catch (e) {
        console.log("deleteCommentNotification error: ", e);
        throw new Error(e);
    }
}

export const insertReactionNotification = async (newReaction) => {
    try {
        const {
            id,
            user_id,
            post_id,
            comment_id,
        } = newReaction;

        const query = { 
            userId: Number(user_id), 
            postId: Number(post_id),
            commentId: comment_id || null, // if reply there will be comment_id
            targetId: Number(id),
            type: comment_id ? NotificationTypes.REACTION_TO_COMMENT : NotificationTypes.REACTION_TO_POST,
        };
        const alreadyNotification = await Notification.find(query);

        if (alreadyNotification.length > 0) {
            return null;
        }

        const insert = { 
            userId: parseInt(user_id), 
            postId: parseInt(post_id),
            commentId: comment_id || null,
            targetId: parseInt(id),
            type: comment_id ? NotificationTypes.REACTION_TO_COMMENT : NotificationTypes.REACTION_TO_POST,
            readBy: [parseInt(user_id)],
        };
    
        // Create a new feed entry
        const newNotification = new Notification(insert);
    
        // Save the entry to the database
        return await newNotification.save();
    } catch (e) {
        console.log("insertCommentNotification error: ", e);
        throw new Error(e);
    }
}

export const deleteReactionNotification = async oldReaction => {
    try {
        const {
            id,
            user_id,
            post_id,
            comment_id,
        } = oldReaction;

        const query = {
            $or: [
                { 
                    // reaction 
                    $and: [
                        { userId: user_id },
                        { postId: post_id },
                        { commentId: null },
                        { targetId: id },
                        { type: NotificationTypes.REACTION_TO_POST }
                    ]
                },
                { 
                    // comment reactions
                    $and: [
                        { userId: user_id },
                        { postId: post_id },
                        { commentId: comment_id },
                        { targetId: id },
                        { type: NotificationTypes.REACTION_TO_COMMENT }
                    ]
                },
            ],
        };

        const foundIds = await Notification.find(query, '_id');
        const result = await Notification.deleteMany(query);
        
        return {
            ...result,
            foundIds,
        };
    } catch (e) {
        console.log("deleteCommentNotification error: ", e);
        throw new Error(e);
    }
}

export const findUserNotifications = async (currentUserId, pageSize, skip) => {
    try {
        /*  1. find all POSTS ids of the CURRENT user (postIds)
            2. find all COMMENTS ids (commentIds) AND comment postIds (commentPostIds) of the CURRENT user 
            3. find notifications that: 
                (commentId in commentIds || postId in postIds || targetId = currentUserId ) 
                && userId <> currentUserId 
            4. find if a FRIEND has COMMENTED in a POST that the CURRENT user ALSO COMMENTED:
                - find active friends user ids (friendsIds)
                - notifications that:
                    (type is in (5, 6) && postId on commentPostIds && userId in friendsIds)
        */
        const postsResults = await postgresQuery(findAllUserPostIdsSQL, [parseInt(currentUserId)]);
        const commentsResults = await postgresQuery(findAllCommentsByUserId, [parseInt(currentUserId)]);
        const friendsResults = await postgresQuery(findAllActiveFriendshipsByUserId, [parseInt(currentUserId)]);

        const postIds = postsResults ? postsResults.rows.map(p => p.id) : [];
        const commentIds = commentsResults ? commentsResults.rows.map(c => c.id) : [];
        const commentPostIds = commentsResults ? commentsResults.rows.map(c => c.post_id) : [];
        const friendsIds = friendsResults ? friendsResults.rows.map(f => f.friend_id) : [];

        const matchCase = {
            $match: {
              userId: { $ne: currentUserId },
              $or: [
                { postId: { $in: postIds } }, // postId in postIds
                { commentId: { $in: commentIds } }, // commentId in commentIds
                { 
                    targetId: currentUserId,
                    type: { $in: [1, 2] }, 
                }, // targetId = currentUserId
                { 
                    type: { $in: [5, 6] }, 
                    postId: { $in: commentPostIds },
                    userId: { $in: friendsIds }
                }
              ]
            }
        };

        const pipeline = [
            matchCase,
            {
                $sort: {
                  timestamp: -1
                }
            },
            {
                $skip: skip
            },
            {
                $limit: pageSize
            },
        ];

        const notifications = await Notification.aggregate(pipeline);
        const countResult = await Notification.aggregate([matchCase]);

        return {
            totalRecords: countResult.length,
            notifications,
        }
    } catch (e) {
        console.log("findUserNotifications error: ", e);
        throw new Error(e);
    }
}

export const findUnreadUserNotifications = async (currentUserId) => {
    try {
        const postsResults = await postgresQuery(findAllUserPostIdsSQL, [parseInt(currentUserId)]);
        const commentsResults = await postgresQuery(findAllCommentsByUserId, [parseInt(currentUserId)]);
        const friendsResults = await postgresQuery(findAllActiveFriendshipsByUserId, [parseInt(currentUserId)]);

        const postIds = postsResults ? postsResults.rows.map(p => p.id) : [];
        const commentIds = commentsResults ? commentsResults.rows.map(c => c.id) : [];
        const commentPostIds = commentsResults ? commentsResults.rows.map(c => c.post_id) : [];
        const friendsIds = friendsResults ? friendsResults.rows.map(f => f.friend_id) : [];

        const pipeline = [
            {
                $match: {
                    userId: { $ne: currentUserId },
                    $or: [
                      { postId: { $in: postIds } }, // postId in postIds
                      { commentId: { $in: commentIds } }, // commentId in commentIds
                      { 
                          targetId: currentUserId,
                          type: { $in: [1, 2] }, 
                      }, // targetId = currentUserId
                      { 
                          type: { $in: [5, 6] }, 
                          postId: { $in: commentPostIds },
                          userId: { $in: friendsIds }
                      }
                    ],
                    readBy: { 
                        $nin: [Number(currentUserId)] 
                    }, 
                }
            },
            {
                $sort: {
                  timestamp: -1
                }
            },
        ];
        const results = await Notification.aggregate(pipeline);
        return {
            notifications: results || [],
            total: results ? results.length : 0
        };
    } catch (e) {
        console.log("findUnreadUserNotifications error: ", e);
        throw new Error(e);
    } 
}

export const addUserToNotificationsReadBy = async (currentUserId) => {
    try {
        const unreadNotifications = await findUnreadUserNotifications(currentUserId);
        const unreadIds = unreadNotifications.notifications.map(n => n._id);

        const query = { 
            _id: { 
                $in: unreadIds
            },
        }
        const results = await Notification.updateMany(query, { $addToSet: { readBy: parseInt(currentUserId) } });
        
        return {
            ...results,
            readIds: unreadIds,
        };
    } catch (e) {
        console.log("addUserToNotificationsReadBy error: ", e);
        throw new Error(e);
    } 
}