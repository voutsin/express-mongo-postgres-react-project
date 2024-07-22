import { MessageStatus } from "../common/enums.js";
import { addUserToNotificationsReadBy, findUnreadUserNotifications, findUserNotifications } from "../db/repositories/NotificationRepository.js";
import { feedToNotificationResDto } from "../mapper/feedMapper.js";
import { socketErrorCallback } from "./utils.js";

export default io => {

    const getUserNotifications = async function (payload, callback) {
        try {
            const socket = this;
            const { authUser } = socket;

            let response = {
                status: MessageStatus.SENT
            }

            const page = parseInt(payload.page) || 1; // default to page 1 if not provided
            const pageSize = parseInt(payload.pageSize) || 10; // default to 10 items per page if not provided
            const skip = (page - 1) * pageSize;

            const notificationResults = await findUserNotifications(parseInt(authUser.userId), pageSize, skip)
            const notifications = await feedToNotificationResDto(notificationResults.notifications);
            response = {
                ...response,
                page,
                pageSize,
                totalPages: Math.ceil(notificationResults.totalRecords / pageSize),
                totalRecords: notificationResults.totalRecords,
                feeds: notifications,
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

    const getUserUnreadNotifications = async function (payload, callback) {
        try {
            const socket = this;
            const { authUser } = socket;

            let response = {
                status: MessageStatus.SENT
            }

            const notificationResults = await findUnreadUserNotifications(parseInt(authUser.userId))
            const notifications = await feedToNotificationResDto(notificationResults.notifications);
            response = {
                ...response,
                totalRecords: notificationResults.total,
                notifications,
            }
            
            callback(response);
            socket.emit('receive_unread_notifications', response);
        } catch (e) {
            // Send error back to the user
            console.log('SOCKET ERROR: ', e)
            io.emit('error_message', 'Failed to get notifications');
            callback(socketErrorCallback(e));
        }
    }

    const markNotificationsReadByUser = async function (payload, callback) {
        const socket = this;
        const { authUser } = socket;

        try {
            const results = await addUserToNotificationsReadBy(authUser.userId);
            const response = {
                ...results,
                status: MessageStatus.SENT
            };
            callback(response);
            // Broadcast the message to all connected clients
            socket.emit('notifications_read', response);
        } catch (e) {
            console.log('SOCKET ERROR: ', e);
            // Send error back to the user
            io.emit('error_message', 'Failed to read messages');
            callback(socketErrorCallback(e));
        }

    }

    return {
        getUserNotifications,
        getUserUnreadNotifications,
        markNotificationsReadByUser,
    }
};