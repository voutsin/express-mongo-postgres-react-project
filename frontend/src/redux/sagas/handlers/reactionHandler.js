import { call, put } from "redux-saga/effects";
import { refreshPostData, setApiData, setError, updateCommentData, updateReplyCommentData } from "../../actions/actions";
import { request } from "../requests/authReqs";
import { REACTIONS_ROUTES } from "../../../config/apiRoutes";
import { getDeepProp } from "../../../common/utils";

export function* handleGetPostReactions(action) {
    try {
        const payload = {
            routeObj: REACTIONS_ROUTES.VIEW_POST_REACTIONS,
            data: { id: action.payload },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: REACTIONS_ROUTES.VIEW_POST_REACTIONS.name,
        }
        yield put(setApiData(reduxPayload));
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleAddNewReaction(action) {
    try {
        const payload = {
            routeObj: REACTIONS_ROUTES.ADD_NEW_REACTION,
            data: action.payload,
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const post = getDeepProp(response, 'data.post');
        yield put(refreshPostData(post));
        if (data && data.comment) {
            if (data.comment.isReply) {
                yield put(updateReplyCommentData(data.comment));
            } else {
                yield put(updateCommentData(data.comment));
            }
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleUpdateReaction(action) {
    try {
        const payload = {
            routeObj: REACTIONS_ROUTES.UPDATE_REACTION,
            data: action.payload,
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const post = getDeepProp(response, 'data.post');
        yield put(refreshPostData(post));
        if (data && data.comment) {
            if (data.comment.isReply) {
                yield put(updateReplyCommentData(data.comment));
            } else {
                yield put(updateCommentData(data.comment));
            }
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleDeleteReaction(action) {
    try {
        const payload = {
            routeObj: REACTIONS_ROUTES.DELETE_REACTION,
            data: { id: action.payload.id },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const post = getDeepProp(response, 'data.post');
        yield put(refreshPostData(post));
        if (data && data.comment) {
            if (data.comment.isReply) {
                yield put(updateReplyCommentData(data.comment));
            } else {
                yield put(updateCommentData(data.comment));
            }
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleGetCommentReaction(action) {
    try {
        const payload = {
            routeObj: REACTIONS_ROUTES.VIEW_COMMENT_REACTIONS,
            data: { id: action.payload },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: REACTIONS_ROUTES.VIEW_COMMENT_REACTIONS.name,
        }
        yield put(setApiData(reduxPayload));
    } catch (error) {
        yield put(setError(error));
    }
}