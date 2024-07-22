import ActionTypes from "../actions/actionTypes";


const defaultState = {};

// FINALS
export const CHAT_STATE = {
    GROUPS_LIST: 'GROUPS_LIST',
    MESSAGES_LIST: 'MESSAGES_LIST',
    ONLINE_FRIENDS: 'ONLINE_FRIENDS',
}

export const chatReducer = (state = defaultState, action) => {
    let updatedState = { ...state };

    switch(action.type) {
        case ActionTypes.CLEAR_CHAT_DATA:
            const stateValues = action.payload;
            if (stateValues == null) {
                return defaultState;
            }
            updatedState = Object.assign({}, state);
            Object.keys(updatedState).forEach(key => {
                if (stateValues.includes(key)) {
                    updatedState[key] = null;
                }
            })
            return updatedState;
        case ActionTypes.SET_MESSAGE_GROUPS_DATA:
            const newGroupsList = action.payload;
            const oldGroupsList = updatedState[CHAT_STATE.GROUPS_LIST];

            let updatedGroupsList = [];
            if (oldGroupsList) {
                const groupIds = newGroupsList.map(g => g.id).filter(id => id != null);
                updatedGroupsList = oldGroupsList.filter(g => !groupIds.includes(g.id)); // filter existing posts
                updatedGroupsList.push(...newGroupsList);
            } else {
                updatedGroupsList = [...newGroupsList];
            }
            
            return {
                ...updatedState,
                [CHAT_STATE.GROUPS_LIST]: updatedGroupsList,
            }
        case ActionTypes.UPDATE_GROUP_READS:
            const targetGroupId = action.payload.groupId;
            const readMessages = action.payload.modifiedCount;

            return {
                ...updatedState,
                [CHAT_STATE.GROUPS_LIST]: updatedState[CHAT_STATE.GROUPS_LIST]
                    ? updatedState[CHAT_STATE.GROUPS_LIST].map(g => {
                        if (g.id === targetGroupId) {
                            return {
                                ...g,
                                hasNewMessage: g.hasNewMessage && g.hasNewMessage > 0 ? g.hasNewMessage - readMessages : 0,
                            }
                        }
                        return {...g};
                    })
                    : null,
            }
        case ActionTypes.SET_GROUP_MESSAGES_DATA:
            const newMessagesList = action.payload.messages;
            const oldMessagesList = updatedState[CHAT_STATE.MESSAGES_LIST];

            let updatedMessagesList = [];
            if (oldMessagesList) {
                const messageIds = newMessagesList.map(m => m.id).filter(id => id != null);
                updatedMessagesList = oldMessagesList.filter(m => !messageIds.includes(m.id)); // filter existing posts
                updatedMessagesList.push(...newMessagesList);
            } else {
                updatedMessagesList = [...newMessagesList];
            }
            
            return {
                ...updatedState,
                [CHAT_STATE.MESSAGES_LIST]: updatedMessagesList,
            }
        case ActionTypes.RECEIVE_MESSAGE:
            const newMessage = action.payload.message;
            const messagesList = updatedState[CHAT_STATE.MESSAGES_LIST];

            const newMessagesGroupId = newMessage.groupId;
            const oldMessagesGroupId = messagesList && messagesList[0] && messagesList[0].groupId;

            // if there is open chat and a message from other chat sent
            if (newMessagesGroupId !== oldMessagesGroupId) {
                return {
                    ...updatedState,
                    [CHAT_STATE.GROUPS_LIST]: updatedState[CHAT_STATE.GROUPS_LIST].map(g => {
                        if (g.id === newMessagesGroupId) {
                            const userRead = newMessage.readBy.includes(action.payload.activeUserId);
                            return {
                                ...g,
                                hasNewMessage: userRead ? 0 : g.hasNewMessage ? g.hasNewMessage + 1 : 1,
                            }
                        }
                        return g;
                    }),
                    [CHAT_STATE.MESSAGES_LIST]: updatedState[CHAT_STATE.MESSAGES_LIST]
                        ? updatedState[CHAT_STATE.MESSAGES_LIST]
                        : [newMessage]
                }
            }

            return {
                ...updatedState,
                [CHAT_STATE.MESSAGES_LIST]: messagesList 
                    ? [
                        ...messagesList.filter(m => m.id !== newMessage.id),
                        newMessage
                    ]
                    : [newMessage]
            };
        case ActionTypes.SET_ONLINE_FRIENDS:
            const onlineFriends = action.payload;
            const groupsList = updatedState[CHAT_STATE.GROUPS_LIST];

            return {
                ...updatedState,
                [CHAT_STATE.ONLINE_FRIENDS]: action.payload,
                [CHAT_STATE.GROUPS_LIST]: groupsList 
                    ? groupsList.map(group => ({
                        ...group,
                        members: group.members.map(member => {
                            member.online = onlineFriends.includes(member.id);
                            return member;
                        })
                    }))
                    : groupsList
            }
        default:
            return state;
    }
}

//SELECTORS
export const selectGroupList = (state) => (state.chat && state.chat[CHAT_STATE.GROUPS_LIST]);
export const selectMessageList = (state) => (state.chat && state.chat[CHAT_STATE.MESSAGES_LIST]);
export const selectOnlineFriends = (state) => (state.chat && state.chat[CHAT_STATE.ONLINE_FRIENDS]);
export const selectUnreadCount = state => {
    if (state.chat && state.chat[CHAT_STATE.GROUPS_LIST]) {
        const groups = state.chat[CHAT_STATE.GROUPS_LIST].filter(g => g.hasNewMessage > 0);
        return groups.length;
    } else return null;
}