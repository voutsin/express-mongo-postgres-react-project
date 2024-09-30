import { call, put } from "redux-saga/effects";
import { setError } from "../../actions/actions";

export function* getNotificationsHandler(action, socket) {
    try {
        const response = yield call((payload) => getNotificationsFromSocket(payload, socket), action.payload);
        if (response.status.code === 2) {
            throw new Error(response.message);
        } 
    } catch (error) {
        // handle error
        console.error(error);
        const err = {response: {data: error}}
        yield put(setError(err));
    }
}
function getNotificationsFromSocket(payload, socket) {
    return new Promise((resolve, reject) => {
        socket.emit('get_notifications', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

export function* getUnreadNotificationsHandler(action, socket) {
    try {
        const response = yield call((payload) => getUnreadNotificationsFromSocket(payload, socket), action.payload);
        if (response.status.code === 2) {
            throw new Error(response.message);
        } 
    } catch (error) {
        // handle error
        console.error(error);
        const err = {response: {data: error}}
        yield put(setError(err));
    }
}
function getUnreadNotificationsFromSocket(payload, socket) {
    return new Promise((resolve, reject) => {
        socket.emit('get_unread_notifications', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}

export function* markReadNotificationsHandler(action, socket) {
    try {
        const response = yield call((payload) => markReadNotificationsToSocket(payload, socket), action.payload);
        if (response.status.code === 2) {
            throw new Error(response.message);
        } 
    } catch (error) {
        // handle error
        console.error(error);
        const err = {response: {data: error}}
        yield put(setError(err));
    }
}
function markReadNotificationsToSocket(payload, socket) {
    return new Promise((resolve, reject) => {
        socket.emit('read_notifications', payload, (response) => {
            if (response.status.code === 2) {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
}