import { getDeepProp } from "../../common/utils";
import ActionTypes from "../actions/actionTypes";


const defaultState = {};

export const authReducer = (state = defaultState, action) => {
    switch(action.type) {
        case ActionTypes.SET_USER_TOKENS:
            const userData = getDeepProp(action, 'payload.response');
            return {
                ...state,
                ...userData.data,
                authSuccess: userData.success,
                error: null,
            };
        case ActionTypes.LOGOUT:
            return defaultState;
        case ActionTypes.SET_ERROR:
            return {
                ...state,
                error: action.payload.error.response
            }
        default:
            return state;
    }
}

//SELECTORS
export const selectUserState = (state) => state;