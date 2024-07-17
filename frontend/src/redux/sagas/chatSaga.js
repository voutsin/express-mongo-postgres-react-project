import { call, fork, put, take, takeEvery } from "redux-saga/effects";
import { eventChannel } from 'redux-saga';
import { receiveMessage, setError, setGroupMessagesData, setMessageGroupData } from "../actions/actions";
import { socket } from "../../config/socket";
import ActionTypes from "../actions/actionTypes";

const chatSocket = socket();

function* logoutHandler() {
    try {
        const response = yield call(disconnectSocket);
        if (response.status.code === 2) {
            throw new Error(response.message);
        } 
    } catch (error) {
        // handle error
        //error.response.data.errors = []
        const err = {response: {data: {errors: [error]}}}
        yield put(setError(err));
    }
}

function disconnectSocket() {
    return new Promise((resolve, reject) => {
        chatSocket.emit('disconnect', {}, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}


function* sendMessageHandler(action) {
    try {
        const response = yield call(sendMessageToSocket, action.payload);
        if (response.status.code === 2) {
            throw new Error(response.message);
        } 
    } catch (error) {
        // handle error
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

function* receiveMessagesDataHandler() {
    const channel = yield call(createSocketChannel, chatSocket);
    while (true) {
        const { 
            message, 
            messages, 
            messagesAndGroup, 
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
            yield put(receiveMessage(messagesAndGroup.message));
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

        const errorHandler = (error) => {
            emit({error});
        };
        
        socket.on('receive_message_and_group', messagesAndGroupDataHandler);
        socket.on('receive_messages', messagesDataHandler);
        socket.on('receive_message', messageHandler);
        socket.on('error_message', errorHandler);

        return () => {
            socket.off('receive_message_and_group', messagesAndGroupDataHandler);
            socket.off('receive_messages', messagesDataHandler);
            socket.off('receive_message', messageHandler);
            socket.off('error_message', errorHandler);
        };
    });
}

export function* watchChat() {
    yield takeEvery(ActionTypes.SEND_MESSAGE, sendMessageHandler);
    yield takeEvery(ActionTypes.GET_GROUP_MESSAGES, getMessagesHandler);
    yield takeEvery(ActionTypes.LOGOUT, logoutHandler);
    yield fork(receiveMessagesDataHandler);
}