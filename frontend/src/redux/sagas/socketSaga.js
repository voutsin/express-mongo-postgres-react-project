import { call, fork, put, select, take, takeEvery } from "redux-saga/effects";
import { receiveMessage, setGroupMessagesData, setMessageGroupData, setNotificationsData, setOnlineFriendsList, updateGroupReads } from "../actions/actions";
import { socket } from "../../config/socket";
import ActionTypes from "../actions/actionTypes";
import { selectAuthState } from "../reducers/authReducer";
import { getMessagesHandler, getOnlineUsersHandler, readGroupMessagesHandler, sendMessageHandler } from "./handlers/chatHandler";
import { eventChannel } from "redux-saga";
import { getNotificationsHandler } from "./handlers/notificationHandler";

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

    // general
    yield fork(socketDataHandler);
}