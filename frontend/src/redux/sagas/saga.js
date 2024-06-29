import { takeLatest } from 'redux-saga/effects';
import ActionTypes from '../actions/actionTypes';
import { handleUserLogin, handleUserLogout, handleUserVerification } from './handlers/auth';
import { handleFindUserFriends, handleFindUserFriendsBirthdays, handleUserRegistration } from './handlers/usersHandler';

/**
 * when the action is triggered the watcher will execute the handle function
 */
export default function* rootSaga() {
    yield takeLatest(ActionTypes.LOGIN, handleUserLogin);
    yield takeLatest(ActionTypes.VERIFY, handleUserVerification);
    yield takeLatest(ActionTypes.LOGOUT, handleUserLogout);
    yield takeLatest(ActionTypes.REGISTER_USER, handleUserRegistration);
    yield takeLatest(ActionTypes.FIND_USER_FRIENDS, handleFindUserFriends);
    yield takeLatest(ActionTypes.FIND_USER_FRIENDS_BIRTHDAYS, handleFindUserFriendsBirthdays);
}