import { call, fork, put, select, take, takeEvery } from "redux-saga/effects";
import { eventChannel } from 'redux-saga';
import { receiveMessage, setError, setGroupMessagesData, setMessageGroupData, setOnlineFriendsList, updateGroupReads } from "../actions/actions";
import { socket } from "../../config/socket";
import ActionTypes from "../actions/actionTypes";
import { selectAuthState } from "../reducers/authReducer";

const chatSocket = socket();

function* sendMessageHandler(action) {
    try {
        const response = yield call(sendMessageToSocket, action.payload);
        if (response.status.code === 2) {
            throw new Error(response.message);
        } 
    } catch (error) {
        // handle error
        console.error(error);
        //error.response.data.errors = []
        const err = {response: {data: {errors: [error]}}}
        yield put(setError(err));
    }
}

function sendMessageToSocket(payload) {
    return new Promise((resolve, reject) => {
        chatSocket.emit('send_message', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

function* getMessagesHandler(action) {
    try {
        const response = yield call(getMessagesFromSocket, action.payload);
        if (response.status.code === 2) {
            throw new Error(response.message);
        } 
    } catch (error) {
        // handle error
        console.error(error);
        //error.response.data.errors = []
        const err = {response: {data: {errors: [error]}}}
        yield put(setError(err));
    }
}

function getMessagesFromSocket(payload) {
    return new Promise((resolve, reject) => {
        chatSocket.emit('get_messages', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

function* readGroupMessagesHandler(action) {
    try {
        const response = yield call(readMessagesToSocket, action.payload);
        if (response.status.code === 2) {
            throw new Error(response.message);
        } 
    } catch (error) {
        // handle error
        console.error(error);
        //error.response.data.errors = []
        const err = {response: {data: {errors: [error]}}}
        yield put(setError(err));
    }
}

function readMessagesToSocket(payload) {
    return new Promise((resolve, reject) => {
        chatSocket.emit('read_messages', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

function* getOnlineUsersHandler(action) {
    try {
        const response = yield call(getOnlineUsersFromSocket, action.payload);
        if (response.status.code === 2) {
            throw new Error(response.message);
        } 
    } catch (error) {
        // handle error
        console.error(error);
        //error.response.data.errors = []
        const err = {response: {data: {errors: [error]}}}
        yield put(setError(err));
    }
}

function getOnlineUsersFromSocket(payload) {
    return new Promise((resolve, reject) => {
        chatSocket.emit('get_online_friends', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

function* receiveMessagesDataHandler() {
    const channel = yield call(createSocketChannel, chatSocket);
    while (true) {
        const { 
            message, 
            messages, 
            messagesAndGroup, 
            readMessages,
            onlineFriends,
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
        }
    }
}

function createSocketChannel(socket) {
    return eventChannel((emit) => {
        const messagesAndGroupDataHandler = (data) => {
            emit({messagesAndGroup: data});
        };

        const messagesDataHandler = (messages) => {
            emit({messages});
        };

        const messageHandler = (message) => {
            emit({message});
        };

        const readHandler = data => {
            emit({readMessages: data})
        }

        const onlineFriendsHandler = onlineFriends => {
            emit({onlineFriends})
        }

        const errorHandler = (error) => {
            emit({error});
        };
        
        socket.on('receive_message_and_group', messagesAndGroupDataHandler);
        socket.on('receive_messages', messagesDataHandler);
        socket.on('receive_message', messageHandler);
        socket.on('messages_read', readHandler);
        socket.on('online_friends_list', onlineFriendsHandler);
        socket.on('error_message', errorHandler);

        return () => {
            socket.off('receive_message_and_group', messagesAndGroupDataHandler);
            socket.off('receive_messages', messagesDataHandler);
            socket.off('receive_message', messageHandler);
            socket.off('messages_read', readHandler);
            socket.off('online_friends_list', onlineFriendsHandler);
            socket.off('error_message', errorHandler);
        };
    });
}

export function* watchChat() {
    yield takeEvery(ActionTypes.SEND_MESSAGE, sendMessageHandler);
    yield takeEvery(ActionTypes.GET_GROUP_MESSAGES, getMessagesHandler);
    yield takeEvery(ActionTypes.READ_GROUP_MESSAGES, readGroupMessagesHandler);
    yield takeEvery(ActionTypes.GET_ACTIVE_CHAT_USERS, getOnlineUsersHandler);
    yield fork(receiveMessagesDataHandler);
}