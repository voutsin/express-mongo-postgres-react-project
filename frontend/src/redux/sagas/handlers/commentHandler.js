import { call, put } from "redux-saga/effects";
import { setApiData, setError, setNewCommentData, setNewReplyData, updateCommentData, updateReplyCommentData, setCommentsList, setCommentsRepliesList, refreshPostWithCommentData } from "../../actions/actions";
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
            yield put(refreshPostWithCommentData(data, 'ADD'));
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
            yield put(refreshPostWithCommentData(action.payload, 'DELETE'));
            // yield put(refreshTopFeedCommentData(action.payload, 'DELETE_COMMENT'));
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

export function* handleGetPostComments(action) {
    try {
        const { id, page, limit } = action.payload;
        const payload = {
            routeObj: COMMENTS_ROUTES.VIEW_POST_COMMENTS,
            data: { id, page, limit, },
            params: true
        };
        const response = yield call(request, payload);
        const { data } = response;

        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: COMMENTS_ROUTES.VIEW_POST_COMMENTS.name,
        }
        yield put(setApiData(reduxPayload));

        if (data) {
            yield put(setCommentsList(data.comments, action.payload.id));
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleGetCommentReplies(action) {
    try {
        const { postId, id, page, limit } = action.payload;
        const payload = {
            routeObj: COMMENTS_ROUTES.VIEW_COMMENT_REPLIES,
            data: { id, page, limit, },
            params: true
        };
        const response = yield call(request, payload);
        const { data } = response;

        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: COMMENTS_ROUTES.VIEW_COMMENT_REPLIES.name,
        }
        yield put(setApiData(reduxPayload));

        if (data) {
            yield put(setCommentsRepliesList(data.replies, id, postId));
        }
    } catch (error) {
        yield put(setError(error));
    }
}