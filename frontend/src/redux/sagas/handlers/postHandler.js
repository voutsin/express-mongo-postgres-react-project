import { call, put, select } from "redux-saga/effects";
import { addNewPostData, clearData, deletePostData, getUserFeed, setApiData, setError, updatePostData } from "../../actions/actions";
import { multiPartRequest, request } from "../requests/authReqs";
import { FEED_ROUTES, POSTS_ROUTES } from "../../../config/apiRoutes";
import { selectFeedData } from "../../reducers/apiReducer";

export function* handleAddNewPost(action) {
    try {
        const {
            finalBody, file
        } = action.payload;

        const formData = new FormData();
        if (file) {
            formData.append('media_url', file);
        }
        Object.keys(finalBody).forEach(key => {
            formData.append(key, finalBody[key]);
        });

        const postPayload = {
            routeObj: POSTS_ROUTES.ADD_NEW_POST,
            data: formData,
        };
        const response = yield call(multiPartRequest, postPayload);
        
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: POSTS_ROUTES.ADD_NEW_POST.name,
        }
        yield put(setApiData(reduxPayload));
        if (data) {
            yield put(addNewPostData(data));
            const feedData = yield select(selectFeedData);
            if (feedData) {
                yield put(clearData([FEED_ROUTES.GET_FEED.name]));
                yield put(getUserFeed({page: 1, pageSize: 10}));
            }
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleDeletePost(action) {
    try {
        const payload = {
            routeObj: POSTS_ROUTES.DELETE_POST,
            data: { id: action.payload.id },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;

        if (data) {
            // remove feed and post
            yield put(deletePostData(data))
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleUpdatePost(action) {
    try {
        const {
            finalBody, file
        } = action.payload;

        const formData = new FormData();
        if (file) {
            formData.append('media_url', file);
        }
        Object.keys(finalBody).forEach(key => {
            formData.append(key, finalBody[key]);
        });

        const postPayload = {
            routeObj: POSTS_ROUTES.UPDATE_POST,
            data: formData,
        };
        const response = yield call(multiPartRequest, postPayload);
        
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: POSTS_ROUTES.UPDATE_POST.name,
        }
        yield put(setApiData(reduxPayload));

        if (data) {
            // update post data
            yield put(updatePostData(data));
        }
    } catch (error) {
        yield put(setError(error));
    }
}