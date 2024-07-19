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