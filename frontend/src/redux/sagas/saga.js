import { fork, takeLatest } from 'redux-saga/effects';
import ActionTypes from '../actions/actionTypes';
import { handleUserLogin, handleUserLogout, handleUserVerification } from './handlers/auth';
import { handleAcceptFriendRequest, handleBlockUser, handleDeleteFriendship, handleFindDetailedUserFriends, handleFindUserDetails, handleFindUserFriends, handleFindUserFriendsBirthdays, handleFindUserMedia, handleSendFriendRequest, handleUserRegistration } from './handlers/usersHandler';
import { handleGetUserFeed } from './handlers/feedHandler';
import { handleAddNewReaction, handleDeleteReaction, handleGetCommentReaction, handleGetPostReactions, handleUpdateReaction } from './handlers/reactionHandler';
import { handleAddNewComment, handleAddReplyComment, handleDeleteComment, handleGetCommentReplies, handleGetPostComments, handleUpdateComment } from './handlers/commentHandler';
import { handleAddNewPost, handleDeletePost, handleGetSinglePost, handleGetUserPosts, handleUpdatePost } from './handlers/postHandler';
import { handleGetUserMessageGroups } from './handlers/chatHandler';
import { watchSocket } from './socketSaga';

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
    yield takeLatest(ActionTypes.FIND_USER_INFO, handleFindUserDetails);
    yield takeLatest(ActionTypes.FIND_USER_MEDIA, handleFindUserMedia);
    // feed
    yield takeLatest(ActionTypes.GET_USER_FEED, handleGetUserFeed);
    // post
    yield takeLatest(ActionTypes.GET_POST_REACTIONS, handleGetPostReactions);
    yield takeLatest(ActionTypes.ADD_NEW_POST, handleAddNewPost);
    yield takeLatest(ActionTypes.DELETE_POST, handleDeletePost);
    yield takeLatest(ActionTypes.UPDATE_POST, handleUpdatePost);
    yield takeLatest(ActionTypes.FIND_USER_POST_LIST, handleGetUserPosts);
    yield takeLatest(ActionTypes.GET_SINGLE_POST, handleGetSinglePost);
    // friends
    yield takeLatest(ActionTypes.FIND_USER_FRIENDS, handleFindUserFriends);
    yield takeLatest(ActionTypes.FIND_DETAILED_USER_FRIENDS, handleFindDetailedUserFriends);
    yield takeLatest(ActionTypes.FIND_USER_FRIENDS_BIRTHDAYS, handleFindUserFriendsBirthdays);
    yield takeLatest(ActionTypes.SEND_FRIEND_REQUEST, handleSendFriendRequest);
    yield takeLatest(ActionTypes.ACCEPT_FRIEND_REQUEST, handleAcceptFriendRequest);
    yield takeLatest(ActionTypes.DECLINE_FRIEND_REQUEST, handleDeleteFriendship);
    yield takeLatest(ActionTypes.CANCEL_FRIEND_REQUEST, handleDeleteFriendship);
    yield takeLatest(ActionTypes.DELETE_FRIENDSHIP, handleDeleteFriendship);
    yield takeLatest(ActionTypes.UN_BLOCK_USER, handleDeleteFriendship);
    yield takeLatest(ActionTypes.BLOCK_USER, handleBlockUser);
    // comments
    yield takeLatest(ActionTypes.ADD_NEW_COMMENT, handleAddNewComment);
    yield takeLatest(ActionTypes.UPDATE_COMMENT, handleUpdateComment);
    yield takeLatest(ActionTypes.DELETE_COMMENT, handleDeleteComment);
    yield takeLatest(ActionTypes.ADD_NEW_REPLY, handleAddReplyComment);
    yield takeLatest(ActionTypes.GET_POST_COMMENTS, handleGetPostComments);
    yield takeLatest(ActionTypes.GET_COMMENT_REPLIES, handleGetCommentReplies);
    // reactions
    yield takeLatest(ActionTypes.ADD_NEW_REACTION, handleAddNewReaction);
    yield takeLatest(ActionTypes.UPDATE_REACTION, handleUpdateReaction);
    yield takeLatest(ActionTypes.DELETE_REACTION, handleDeleteReaction);
    yield takeLatest(ActionTypes.GET_COMMENT_REACTIONS, handleGetCommentReaction);
    // chat
    yield fork(watchSocket);
    yield takeLatest(ActionTypes.GET_MESSAGE_GROUPS, handleGetUserMessageGroups);
}