import { NotifyTypes } from "../../common/enums";
import { isObjectEmpty } from "../../common/utils";
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
            const { error } = action.payload;
            if (!error || isObjectEmpty(error)) {
                return {...state}
            }
            const errors = error.response.data.errors || error.response.data.error;
            const errorMessage = Array.isArray(errors) ? errors.map(err => err.msg).join(', <br/>') : errors;
            return {
                error: error.response,
                notify: {
                    type: NotifyTypes.ERROR,
                    message: errorMessage,
                },
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
        case ActionTypes.SET_API_DATA:
            const {apiRouteName, apiSuccess, data} = action.payload;

            if (apiSuccess) {
                return {
                    ...state,
                    [apiRouteName]: {
                        data: data,
                        success: apiSuccess,
                    },
                }
            } else {
                return {...state};
            }
            
        default:
            return state;
    }
}

//SELECTORS
export const selectApiState = (state, valueName) => (state.api && state.api[valueName]);