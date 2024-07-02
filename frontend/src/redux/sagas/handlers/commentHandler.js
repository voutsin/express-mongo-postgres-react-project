import { call, put } from "redux-saga/effects";
import { setApiData, setError } from "../../actions/actions";
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
    } catch (error) {
        yield put(setError(error));
    }
}