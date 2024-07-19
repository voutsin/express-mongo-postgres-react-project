import { call, put } from "redux-saga/effects";
import { request } from "../requests/authReqs";
import { setError, setMessageGroupData } from "../../actions/actions";
import { MESSAGE_ROUTES } from "../../../config/apiRoutes";

export function* handleGetUserMessageGroups() {
    try {
        const payload = {
            routeObj: MESSAGE_ROUTES.FIND_ALL_USER_GROUPS,
            params: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        if (data) {
            yield put(setMessageGroupData(data));
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* getMessagesHandler(action, socket) {
    try {
        const response = yield call((payload) => getMessagesFromSocket(payload, socket), action.payload);
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
function getMessagesFromSocket(payload, socket) {
    return new Promise((resolve, reject) => {
        socket.emit('get_messages', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

export function* readGroupMessagesHandler(action, socket) {
    try {
        const response = yield call((payload) => readMessagesToSocket(payload, socket), action.payload);
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

function readMessagesToSocket(payload, socket) {
    return new Promise((resolve, reject) => {
        socket.emit('read_messages', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

export function* getOnlineUsersHandler(action, socket) {
    try {
        const response = yield call((payload) => getOnlineUsersFromSocket(payload, socket), action.payload);
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

function getOnlineUsersFromSocket(payload, socket) {
    return new Promise((resolve, reject) => {
        socket.emit('get_online_friends', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

export function* sendMessageHandler(action, socket) {
    try {
        const response = yield call((payload) => sendMessageToSocket(payload, socket), action.payload);
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

function sendMessageToSocket(payload, socket) {
    return new Promise((resolve, reject) => {
        socket.emit('send_message', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}
