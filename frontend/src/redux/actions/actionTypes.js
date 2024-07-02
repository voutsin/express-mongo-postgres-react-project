const ActionTypes = {
    LOGIN: "login",
    LOGOUT: 'logout',
    SET_ERROR: 'setError',
    SET_USER_TOKENS: 'setTokens',
    VERIFY: 'userVerify',
    REGISTER_USER: 'userRegister',
    REGISTER_USER_RESPONSE: 'userRegisterResponse',
    CLEAR_DATA: 'clearData',
    NOTIFY: 'notify',
    CLEAR_NOTIFY: 'clearNotify',
    SET_API_DATA: 'setApiData',
    FIND_USER_FRIENDS: 'findUserFriends',
    FIND_USER_FRIENDS_BIRTHDAYS: 'findUserFriendsBirthdays',
    GET_USER_FEED: 'getUserFeed',
    GET_POST_REACTIONS: 'getPostReactions',
    SEND_FRIEND_REQUEST: 'sendFriendRequest',
    ADD_NEW_COMMENT: 'addNewComment',
    ADD_NEW_REACTION: 'addNewReaction',
    UPDATE_REACTION: 'updateReaction',
    DELETE_REACTION: 'deleteReaction',
    REFRESH_POST_DATA: 'refreshPostData',
}

export default ActionTypes;