import ActionTypes from "./actionTypes";

export const login = credentials => ({
    type: ActionTypes.LOGIN,
    payload: credentials
});

export const logout = () => ({
    type: ActionTypes.LOGOUT
});

export const verifyUser = () => ({
    type: ActionTypes.VERIFY
});

export const setError = (error) => {
    return {
        type: ActionTypes.SET_ERROR,
        payload: {
            error
        }
    }
}

export const setUserTokens = response => {
    return {
        type: ActionTypes.SET_USER_TOKENS,
        payload: {
            response
        }
    }
}

export const registerUser = data => ({
    type: ActionTypes.REGISTER_USER,
    payload: data
});

export const clearData = stateValues => ({
    type: ActionTypes.CLEAR_DATA,
    payload: stateValues
});

export const notify = (message, type) => ({
    type: ActionTypes.NOTIFY,
    payload: {message, type}
});

export const clearNotify = () => ({
    type: ActionTypes.CLEAR_NOTIFY,
});

export const setApiData = data => ({
    type: ActionTypes.SET_API_DATA,
    payload: data
});

export const findUserFriends = id => ({
    type: ActionTypes.FIND_USER_FRIENDS,
    payload: id
});

export const findUserFriendsBirthdays = () => ({
    type: ActionTypes.FIND_USER_FRIENDS_BIRTHDAYS,
});

export const getUserFeed = data => ({
    type: ActionTypes.GET_USER_FEED,
    payload: data
});

export const getPostReactions = id => ({
    type: ActionTypes.GET_POST_REACTIONS,
    payload: id
});

export const sendFriendRequest = userId => ({
    type: ActionTypes.SEND_FRIEND_REQUEST,
    payload: userId
});

export const addNewComment = data => ({
    type: ActionTypes.ADD_NEW_COMMENT,
    payload: data
});

export const addNewReaction = data => ({
    type: ActionTypes.ADD_NEW_REACTION,
    payload: data
});

export const updateReaction = data => ({
    type: ActionTypes.UPDATE_REACTION,
    payload: data
});

export const deleteReaction = data => ({
    type: ActionTypes.DELETE_REACTION,
    payload: data
});

export const refreshPostData = post => ({
    type: ActionTypes.REFRESH_POST_DATA,
    payload: post
});