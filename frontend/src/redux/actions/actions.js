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

export const notify = (message, type, extraData) => ({
    type: ActionTypes.NOTIFY,
    payload: {message, type, extraData}
});

export const clearNotify = () => ({
    type: ActionTypes.CLEAR_NOTIFY,
});

export const setApiData = data => ({
    type: ActionTypes.SET_API_DATA,
    payload: data
});

export const setPostListFromFeed = feed => ({
    type: ActionTypes.SET_FEED_POST_DATA,
    payload: feed
})

export const findUserFriends = id => ({
    type: ActionTypes.FIND_USER_FRIENDS,
    payload: id
});

export const getDetailedUserFriends = id => ({
    type: ActionTypes.FIND_DETAILED_USER_FRIENDS,
    payload: id
});

export const sendFriendRequest = userId => ({
    type: ActionTypes.SEND_FRIEND_REQUEST,
    payload: userId
});

export const cancelFriendRequest = userId => ({
    type: ActionTypes.CANCEL_FRIEND_REQUEST,
    payload: userId
});

export const acceptFriendRequest = userId => ({
    type: ActionTypes.ACCEPT_FRIEND_REQUEST,
    payload: userId
});

export const declineFriendRequest = userId => ({
    type: ActionTypes.DECLINE_FRIEND_REQUEST,
    payload: userId
});

export const deleteFriendship = userId => ({
    type: ActionTypes.DELETE_FRIENDSHIP,
    payload: userId
});

export const unBlockUser = id => ({
    type: ActionTypes.UN_BLOCK_USER,
    payload: id
});

export const blockUser = id => ({
    type: ActionTypes.BLOCK_USER,
    payload: id
});

export const findUserFriendsBirthdays = () => ({
    type: ActionTypes.FIND_USER_FRIENDS_BIRTHDAYS,
});

export const getUserFeed = data => ({
    type: ActionTypes.GET_USER_FEED,
    payload: data
});

export const setFeedData = data => ({
    type: ActionTypes.SET_FEED_DATA,
    payload: data
});

export const getPostReactions = id => ({
    type: ActionTypes.GET_POST_REACTIONS,
    payload: id
});

export const getCommentReactions = id => ({
    type: ActionTypes.GET_COMMENT_REACTIONS,
    payload: id
});

export const addNewComment = data => ({
    type: ActionTypes.ADD_NEW_COMMENT,
    payload: data
});

export const updateComment = data => ({
    type: ActionTypes.UPDATE_COMMENT,
    payload: data
});

export const deleteComment = comment => ({
    type: ActionTypes.DELETE_COMMENT,
    payload: comment
});

export const addNewReply = data => ({
    type: ActionTypes.ADD_NEW_REPLY,
    payload: data
});

export const setNewCommentData = comment => ({
    type: ActionTypes.SET_NEW_COMMENT_DATA,
    payload: comment
});

export const setNewReplyData = replyComment => ({
    type: ActionTypes.SET_NEW_REPLY_DATA,
    payload: replyComment
});

export const updateCommentData = (comment, deleteFlag) => ({
    type: ActionTypes.UPDATE_COMMENT_DATA,
    payload: {comment, deleteFlag}
});

export const updateReplyCommentData = (replyComment, deleteFlag) => ({
    type: ActionTypes.UPDATE_REPLY_DATA,
    payload: {replyComment, deleteFlag}
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

export const refreshPostWithCommentData = (comment, commentAction) => ({
    type: ActionTypes.REFRESH_POST_COMMENT_DATA,
    payload: {comment, commentAction}
});

export const refreshTopFeedCommentData = (comment, action) => ({
    type: ActionTypes.REFRESH_TOP_FEED_COMMENT,
    payload: {comment, action}
});

export const clearCommentData = () => ({
    type: ActionTypes.CLEAR_COMMENT_DATA,
});

export const getPostComments = (postId, page, limit) => ({
    type: ActionTypes.GET_POST_COMMENTS,
    payload: {id: postId, page, limit}
});

export const getCommentReplies = (postId, commentId, page, limit) => ({
    type: ActionTypes.GET_COMMENT_REPLIES,
    payload: {postId, id: commentId, page, limit}
});

export const setCommentsList = (comments, postId) => ({
    type: ActionTypes.SET_COMMENTS_LIST,
    payload: {comments, postId}
});

export const setCommentsRepliesList = (replies, commentId, postId) => ({
    type: ActionTypes.SET_COMMENTS_REPLIES_LIST,
    payload: {replies, commentId, postId}
});

export const resetCommentList = () => ({
    type: ActionTypes.RESET_COMMENTS_LIST
});

export const addNewPost = data => ({
    type: ActionTypes.ADD_NEW_POST,
    payload: data
});

export const addNewPostData = post => ({
    type: ActionTypes.ADD_NEW_POST_DATA,
    payload: post
});

export const deletePost = data => ({
    type: ActionTypes.DELETE_POST,
    payload: data
});

export const deletePostData = post => ({
    type: ActionTypes.DELETE_POST_DATA,
    payload: post
});

export const updatePost = data => ({
    type: ActionTypes.UPDATE_POST,
    payload: data
});

export const updatePostData = post => ({
    type: ActionTypes.UPDATE_POST_DATA,
    payload: post
});

export const getUserInfo = userId => ({
    type: ActionTypes.FIND_USER_INFO,
    payload: userId
});

export const getUserMedia = userId => ({
    type: ActionTypes.FIND_USER_MEDIA,
    payload: userId
});

export const getUserPosts = (userId, page, pageSize) => ({
    type: ActionTypes.FIND_USER_POST_LIST,
    payload: {id: userId, page, pageSize}
});

export const setPostListData = posts => ({
    type: ActionTypes.SET_POST_LIST_DATA,
    payload: posts
});

// CHAT
export const disconnectSocket = () => ({
    type: ActionTypes.DISCONNECT_SOCKET,
});

export const clearChatData = stateValues => ({
    type: ActionTypes.CLEAR_CHAT_DATA,
    payload: stateValues
});

export const getMessageGroups = () => ({
    type: ActionTypes.GET_MESSAGE_GROUPS,
});

export const setMessageGroupData = groups => ({
    type: ActionTypes.SET_MESSAGE_GROUPS_DATA,
    payload: groups
});

export const getGroupMessages = (groupId, page, pageSize) => ({
    type: ActionTypes.GET_GROUP_MESSAGES,
    payload: { groupId, page, pageSize }
});

export const setGroupMessagesData = messages => ({
    type: ActionTypes.SET_GROUP_MESSAGES_DATA,
    payload: messages
});

export const sendMessage = (content, groupId, receiverId) => ({
    type: ActionTypes.SEND_MESSAGE,
    payload: { content, groupId, receiverId }
});

export const setMessageData = message => ({
    type: ActionTypes.SET_MESSAGE_DATA,
    payload: message
});

export const receiveMessage = (message, activeUserId) => ({
    type: ActionTypes.RECEIVE_MESSAGE,
    payload: {message, activeUserId}
});

export const readGroupMessages = groupId => ({
    type: ActionTypes.READ_GROUP_MESSAGES,
    payload: {groupId}
});

export const updateGroupReads = (groupId, modifiedCount) => ({
    type: ActionTypes.UPDATE_GROUP_READS,
    payload: {groupId, modifiedCount}
});