import { NotifyTypes } from "../../common/enums";
import { isObjectEmpty } from "../../common/utils";
import { FEED_ROUTES } from "../../config/apiRoutes";
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
                ...state,
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
        case ActionTypes.REFRESH_POST_DATA:
            const updatedPost = action.payload;
            const feedData = state[FEED_ROUTES.GET_FEED.name] && state[FEED_ROUTES.GET_FEED.name].data;
            // TODO: add posts data for user profile

            feedData.feeds.forEach(feed => {
                if (feed.post && feed.post.id === updatedPost.id) {
                    feed.post = updatedPost;
                }
            })

            return {
                ...state,
                [FEED_ROUTES.GET_FEED.name]: state[FEED_ROUTES.GET_FEED.name], // for feed posts
                POST_DATA: updatedPost, // for single post
            }
        default:
            return state;
    }
}

//SELECTORS
export const selectApiState = (state, valueName) => (state.api && state.api[valueName]);
export const selectPostsData = state => {
    if (state.api[FEED_ROUTES.GET_FEED.name] && state.api[FEED_ROUTES.GET_FEED.name].data) {
        return state.api[FEED_ROUTES.GET_FEED.name].data.feeds.map(f => f.post);
    }

    return [state.api.POST_DATA] || [];
}