import { takeLatest } from 'redux-saga/effects';
import ActionTypes from '../actions/actionTypes';
import { handleUserLogin, handleUserLogout, handleUserVerification } from './handlers/auth';
import { handleFindUserFriends, handleFindUserFriendsBirthdays, handleSendFriendRequest, handleUserRegistration } from './handlers/usersHandler';
import { handleGetUserFeed } from './handlers/feedHandler';
import { handleAddNewReaction, handleDeleteReaction, handleGetPostReactions, handleUpdateReaction } from './handlers/reactionHandler';
import { handleAddNewComment } from './handlers/commentHandler';

/**
 * when the action is triggered the watcher will execute the handle function
 */
export default function* rootSaga() {
    // auth
    yield takeLatest(ActionTypes.LOGIN, handleUserLogin);
    yield takeLatest(ActionTypes.VERIFY, handleUserVerification);
    yield takeLatest(ActionTypes.LOGOUT, handleUserLogout);
    yield takeLatest(ActionTypes.REGISTER_USER, handleUserRegistration);
    // users
    yield takeLatest(ActionTypes.FIND_USER_FRIENDS, handleFindUserFriends);
    yield takeLatest(ActionTypes.FIND_USER_FRIENDS_BIRTHDAYS, handleFindUserFriendsBirthdays);
    // feed
    yield takeLatest(ActionTypes.GET_USER_FEED, handleGetUserFeed);
    // post
    yield takeLatest(ActionTypes.GET_POST_REACTIONS, handleGetPostReactions);
    // friends
    yield takeLatest(ActionTypes.SEND_FRIEND_REQUEST, handleSendFriendRequest);
    // comments
    yield takeLatest(ActionTypes.ADD_NEW_COMMENT, handleAddNewComment);
    // reactions
    yield takeLatest(ActionTypes.ADD_NEW_REACTION, handleAddNewReaction);
    yield takeLatest(ActionTypes.UPDATE_REACTION, handleUpdateReaction);
    yield takeLatest(ActionTypes.DELETE_REACTION, handleDeleteReaction);
}