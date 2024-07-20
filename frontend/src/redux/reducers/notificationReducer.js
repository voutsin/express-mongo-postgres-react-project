import ActionTypes from "../actions/actionTypes";


const defaultState = {};

// FINALS
export const NOTIFICATION_STATE = {
    NOTIFICATIONS_LIST: 'NOTIFICATIONS_LIST',
    PAGE: 'PAGE',
    UNREAD_LIST: 'UNREAD_LIST',
}

export const notificationReducer = (state = defaultState, action) => {
    let updatedState = { ...state };

    switch(action.type) {
        case ActionTypes.SET_NOTIFICATIONS_DATA:
            const oldNotifications = updatedState[NOTIFICATION_STATE.NOTIFICATIONS_LIST];
            const newNotifications = action.payload.feeds;
            return {
                ...updatedState,
                [NOTIFICATION_STATE.NOTIFICATIONS_LIST]: oldNotifications
                    ? [
                        ...oldNotifications,
                        ...newNotifications,
                    ]
                    : [
                        ...newNotifications
                    ],
                    [NOTIFICATION_STATE.PAGE]: {
                    ...action.payload,
                    feeds: null,
                }
            };
        case ActionTypes.CLEAR_NOTIFICATION_DATA:
            return {
                ...updatedState,
                [NOTIFICATION_STATE.NOTIFICATIONS_LIST]: null,
                [NOTIFICATION_STATE.PAGE]: null,
                [NOTIFICATION_STATE.UNREAD_LIST]: null,
            }
        case ActionTypes.RECEIVE_NOTIFICATION: 
            const unreadList = updatedState[NOTIFICATION_STATE.UNREAD_LIST];
            const receivedNotification = action.payload;

            const updatedList = unreadList
            ? [
                ...unreadList,
                receivedNotification,
            ]
            : [ receivedNotification ];
            
            return {
                ...updatedState,
                [NOTIFICATION_STATE.UNREAD_LIST]: updatedList,
            };
        case ActionTypes.DELETE_NOTIFICATIONS:
            const idsToDelete = action.payload;
            const unreadNotificationsList = updatedState[NOTIFICATION_STATE.UNREAD_LIST];
            const notificationsList = updatedState[NOTIFICATION_STATE.NOTIFICATIONS_LIST];

            return {
                ...updatedState,
                [NOTIFICATION_STATE.NOTIFICATIONS_LIST]: notificationsList
                    ? notificationsList.filter(n => !idsToDelete.includes(n.id))
                    : null,
                [NOTIFICATION_STATE.UNREAD_LIST]: unreadNotificationsList
                    ? unreadNotificationsList.filter(n => !idsToDelete.includes(n.id))
                    : null,
            }
        case ActionTypes.RECEIVE_UNREAD_NOTIFICATIONS:
            const newUnreadNotifications = action.payload.notifications;
            const unreadNotifications = updatedState[NOTIFICATION_STATE.UNREAD_LIST];

            return {
                ...updatedState,
                [NOTIFICATION_STATE.UNREAD_LIST]: unreadNotifications
                    ? [
                        ...unreadNotifications,
                        ...newUnreadNotifications,
                    ]
                    : [ ...newUnreadNotifications ],
            }
        case ActionTypes.READ_NOTIFICATIONS:
            const readNotificationIds = action.payload.readIds
            const unreadNotificationsState = updatedState[NOTIFICATION_STATE.UNREAD_LIST];
            
            return {
                ...updatedState,
                [NOTIFICATION_STATE.UNREAD_LIST]: unreadNotificationsState
                    ? unreadNotificationsState.filter(n => !readNotificationIds.includes(n.id))
                    : null,
            }
        default:
            return updatedState;
    }
}

//SELECTORS
export const selectNotificationList = (state) => (state.notifications && state.notifications[NOTIFICATION_STATE.NOTIFICATIONS_LIST]);
export const selectNotificationPage = (state) => (state.notifications && state.notifications[NOTIFICATION_STATE.PAGE]);
export const selectNotificationUnreadList = (state) => (state.notifications && state.notifications[NOTIFICATION_STATE.UNREAD_LIST]);
