import { call, put } from "redux-saga/effects";
import { setApiData, setError, setNewCommentData, setNewReplyData, updateCommentData, updateReplyCommentData } from "../../actions/actions";
import { request } from "../requests/authReqs";
import { COMMENTS_ROUTES } from "../../../config/apiRoutes";

export function* handleAddNewComment(action) {
    try {
        const payload = {
            routeObj: COMMENTS_ROUTES.ADD_NEW_COMMENT,
            data: action.payload,
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: COMMENTS_ROUTES.ADD_NEW_COMMENT.name,
        }
        yield put(setApiData(reduxPayload));

        if (data) {
            // add new comment to post comment array
            yield put(setNewCommentData(data));
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleUpdateComment(action) {
    try {
        const payload = {
            routeObj: COMMENTS_ROUTES.UPDATE_COMMENT,
            data: action.payload,
        };
        const response = yield call(request, payload);
        const { data } = response;

        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: COMMENTS_ROUTES.UPDATE_COMMENT.name,
        }
        yield put(setApiData(reduxPayload));

        if (data) {
            // update comment to post comment array
            if (data.isReply) {
                yield put(updateReplyCommentData(data, false));
            } else {
                yield put(updateCommentData(data, false));   
            }
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleDeleteComment(action) {
    try {
        const payload = {
            routeObj: COMMENTS_ROUTES.DELETE_COMMENT,
            data: { id: action.payload.id },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;

        if (data) {
            // add new comment to post comment array 
            if (action.payload.isReply) {
                yield put(updateReplyCommentData(action.payload, true));
            } else {
                yield put(updateCommentData(action.payload, true));   
            }
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleAddReplyComment(action) {
    try {
        const payload = {
            routeObj: COMMENTS_ROUTES.REPLY,
            data: action.payload,
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: COMMENTS_ROUTES.REPLY.name,
        }
        yield put(setApiData(reduxPayload));

        if (data) {
            // add new comment to post comment array 
            yield put(setNewReplyData(data));
        }
    } catch (error) {
        yield put(setError(error));
    }
}