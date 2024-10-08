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

        case ActionTypes.UPDATE_USER_DATA:
            const updatedUser = action.payload;

            return {
                ...state,
                ...updatedUser,
            }
        default:
            return state;
    }
}

//SELECTORS
export const selectAuthState = (state) => state && state.auth;