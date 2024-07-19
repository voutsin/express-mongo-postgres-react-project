import ActionTypes from "../actions/actionTypes";


const defaultState = {};

// FINALS
export const NOTIFICATION_STATE = {
    NOTIFICATIONS_LIST: 'NOTIFICATIONS_LIST',
    PAGE: 'PAGE',
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
            }
        default:
            return updatedState;
    }
}

//SELECTORS
export const selectNotificationList = (state) => (state.notifications && state.notifications[NOTIFICATION_STATE.NOTIFICATIONS_LIST]);
export const selectNotificationPage = (state) => (state.notifications && state.notifications[NOTIFICATION_STATE.PAGE]);
