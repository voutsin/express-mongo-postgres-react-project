import ActionTypes from "../actions/actionTypes";


const defaultState = {};

export const apiReducer = (state = defaultState, action) => {
    switch(action.type) {
        case ActionTypes.CLEAR_DATA:
            const stateValues = action.payload;
            if (stateValues == null) {
                return defaultState;
            }
            const updatedState = Object.assign({}, state);
            Object.keys(updatedState).forEach(key => {
                if (stateValues.includes(key)) {
                    updatedState[key] = null;
                }
            })
            return updatedState;
        case ActionTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload.error.response
            }
        case ActionTypes.NOTIFY:
            return {
                ...state,
                notify: action.payload,
            }
        case ActionTypes.CLEAR_NOTIFY:
            return {
                ...state,
                notify: null,
            }
        case ActionTypes.REGISTER_USER_RESPONSE:
            const apiRouteName = action.payload.apiRouteName;
            return {
                ...state,
                [apiRouteName]: {
                    data: action.payload.data,
                    success: action.payload.apiSuccess,
                },
            }
        default:
            return state;
    }
}

//SELECTORS
export const selectApiState = (state, valueName) => (state.api && state.api[valueName]);