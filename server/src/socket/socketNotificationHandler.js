import { MessageStatus } from "../common/enums.js";
import { postgresQuery } from "../db/postgres.js";
import { findAllUserPostIdsSQL } from "../db/queries/postsQueries.js";
import { findFeedsByPostIdGroupByPost } from "../db/repositories/FeedRepository.js";
import { feedToNotificationResDto } from "../mapper/feedMapper.js";
import { socketErrorCallback } from "./utils.js";

export default io => {
    
    const sendNotificaton = async function (payload, callback) {
        try {
            
            const response = {
                status: MessageStatus.SENT
            }
            callback(response);
        } catch (e) {
            // Send error back to the user
            console.log('SOCKET ERROR: ', e)
            io.emit('error_message', 'Failed to save message');
            callback(socketErrorCallback(e));
        }
    }

    const getUserNotifications = async function (payload, callback) {
        try {
            const socket = this;
            const { authUser } = socket;

            let response = {
                status: MessageStatus.SENT
            }

            // find user posts
            const postsResults = await postgresQuery(findAllUserPostIdsSQL, [parseInt(authUser.userId)]);
            if (postsResults && postsResults.rows) {
                const postIds = postsResults.rows.map(id => id.id);

                const page = parseInt(payload.page) || 1; // default to page 1 if not provided
                const pageSize = parseInt(payload.pageSize) || 10; // default to 10 items per page if not provided
                const skip = (page - 1) * pageSize;
                
                // find Feeds for given ids
                const feedsResults = await findFeedsByPostIdGroupByPost(postIds, parseInt(authUser.userId), pageSize, skip)
                const feeds = await feedToNotificationResDto(feedsResults.feeds);

                response = {
                    ...response,
                    page,
                    pageSize,
                    totalPages: Math.ceil(feedsResults.totalRecords / pageSize),
                    totalRecords: feedsResults.totalRecords,
                    feeds,
                }
            }
            
            callback(response);
            socket.emit('receive_notifications', response);
        } catch (e) {
            // Send error back to the user
            console.log('SOCKET ERROR: ', e)
            io.emit('error_message', 'Failed to get notifications');
            callback(socketErrorCallback(e));
        }
    }

    return {
        sendNotificaton,
        getUserNotifications,
    }
};