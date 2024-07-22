import { call, fork, put, select, take, takeEvery } from "redux-saga/effects";
import { deleteNotification, receiveReadNotifications, receiveMessage, receiveNotification, receiveUnreadNotification, setGroupMessagesData, setMessageGroupData, setNotificationsData, setOnlineFriendsList, updateGroupReads } from "../actions/actions";
import { socket } from "../../config/socket";
import ActionTypes from "../actions/actionTypes";
import { selectAuthState } from "../reducers/authReducer";
import { getMessagesHandler, getOnlineUsersHandler, readGroupMessagesHandler, sendMessageHandler } from "./handlers/chatHandler";
import { eventChannel } from "redux-saga";
import { getNotificationsHandler, getUnreadNotificationsHandler, markReadNotificationsHandler } from "./handlers/notificationHandler";

const chatSocket = socket();

export function createSocketChannel(socket) {
    return eventChannel((emit) => {
        // chat
        const messagesAndGroupDataHandler = (data) => emit({messagesAndGroup: data});;
        const messagesDataHandler = (messages) => emit({messages});
        const messageHandler = (message) => emit({message});
        const readHandler = data => emit({readMessages: data});
        const onlineFriendsHandler = onlineFriends => emit({onlineFriends});

        // notifications
        const notificationsDataHandler = (notifications) => emit({notifications});
        const notificationDataHandler = (notification) => emit({notification});
        const deleteNotificationDataHandler = (deleteNotifications) => emit({deleteNotifications});
        const unreadNotificationsDataHandler = (unreadNotifications) => emit({unreadNotifications});
        const readNotificationsDataHandler = (readNotifications) => emit({readNotifications});

        // general
        const errorHandler = (error) => emit({error});
        
        // chat
        socket.on('receive_message_and_group', messagesAndGroupDataHandler);
        socket.on('receive_messages', messagesDataHandler);
        socket.on('receive_message', messageHandler);
        socket.on('messages_read', readHandler);
        socket.on('online_friends_list', onlineFriendsHandler);

        // notifications
        socket.on('receive_notifications', notificationsDataHandler);
        socket.on('send_notification', notificationDataHandler);
        socket.on('delete_notifications', deleteNotificationDataHandler);
        socket.on('receive_unread_notifications', unreadNotificationsDataHandler);
        socket.on('notifications_read', readNotificationsDataHandler);

        // general
        socket.on('error_message', errorHandler);

        return () => {
            // chat
            socket.off('receive_message_and_group', messagesAndGroupDataHandler);
            socket.off('receive_messages', messagesDataHandler);
            socket.off('receive_message', messageHandler);
            socket.off('messages_read', readHandler);
            socket.off('online_friends_list', onlineFriendsHandler);
            
            // notifications
            socket.off('receive_notifications', notificationsDataHandler);
            socket.off('send_notification', notificationDataHandler);
            socket.off('delete_notifications', deleteNotificationDataHandler);
            socket.off('receive_unread_notifications', unreadNotificationsDataHandler);
            socket.off('notifications_read', readNotificationsDataHandler);

            // general
            socket.off('error_message', errorHandler);
        };
    });
}

function* socketDataHandler() {
    const channel = yield call(createSocketChannel, chatSocket);
    while (true) {
        const { 
            // chat
            message, 
            messages, 
            messagesAndGroup, 
            readMessages,
            onlineFriends,

            // notifications
            notifications,
            notification,
            deleteNotifications,
            unreadNotifications,
            readNotifications,

            // general
            error 
        } = yield take(channel);
        
        if (error) {
            console.error('Error from server:', error);
        } else if (messages) {
            yield put(setGroupMessagesData(messages));
        } else if (message) {
            yield put(receiveMessage(message));
        } else if (messagesAndGroup) {
            yield put(setMessageGroupData([messagesAndGroup.group]));
            const auth = yield select(selectAuthState)
            yield put(receiveMessage(messagesAndGroup.message, auth.id));
        } else if (readMessages) {
            const { groupId, modifiedCount } = readMessages;
            yield put(updateGroupReads(groupId, modifiedCount))
        } else if (onlineFriends) {
            const { activeFriends } = onlineFriends;
            const auth = yield select(selectAuthState)
            yield put(setOnlineFriendsList([...activeFriends, auth.id]));
        } else if (notifications) {
            yield put(setNotificationsData(notifications));
        } else if (notification) {
            yield put(receiveNotification(notification.notification));
        } else if (deleteNotifications) {
            yield put(deleteNotification(deleteNotifications.idsToBeDeleted));
        } else if (unreadNotifications) {
            yield put(receiveUnreadNotification(unreadNotifications));
        } else if (readNotifications) {
            yield put(receiveReadNotifications(readNotifications));
        }
    }
}

export function* watchSocket() {
    // chat
    yield takeEvery(ActionTypes.SEND_MESSAGE, (action) => sendMessageHandler(action, chatSocket));
    yield takeEvery(ActionTypes.GET_GROUP_MESSAGES, (action) => getMessagesHandler(action, chatSocket));
    yield takeEvery(ActionTypes.READ_GROUP_MESSAGES, (action) => readGroupMessagesHandler(action, chatSocket));
    yield takeEvery(ActionTypes.GET_ACTIVE_CHAT_USERS, (action) => getOnlineUsersHandler(action, chatSocket));

    // notifications
    yield takeEvery(ActionTypes.GET_NOTIFICATIONS, (action) => getNotificationsHandler(action, chatSocket));
    yield takeEvery(ActionTypes.GET_UNREAD_NOTIFICATIONS, (action) => getUnreadNotificationsHandler(action, chatSocket));
    yield takeEvery(ActionTypes.MARK_READ_NOTIFICATIONS, (action) => markReadNotificationsHandler(action, chatSocket));

    // general
    yield fork(socketDataHandler);
}