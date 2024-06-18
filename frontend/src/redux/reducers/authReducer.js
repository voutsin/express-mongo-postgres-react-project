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
            };
        case ActionTypes.LOGOUT:
            return {
                ...state,
                auth: null,
            };
        case ActionTypes.SET_ERROR:
            const status = action.payload.error.response && action.payload.error.response.status;
            switch (status) {
                case 403:
                    return {
                        ...state,
                        error: {
                            message: "Δεν βρέθηκε χρήστης με αυτά τα στοιχεία.",
                            status,
                            display: true
                        }
                    }
                case 500:
                    return {
                        ...state,
                        error: {
                            message: "Ο χρήστης με αυτό το username υπάρχει ήδη στο σύστημα.",
                            status,
                            display:true
                        }
                    }
                default:
                    return {
                        ...state,
                        error: action.payload.error.response
                    }
            }
        default:
            return state;
    }
}

//SELECTORS
export const selectUserState = (state) => state.auth;