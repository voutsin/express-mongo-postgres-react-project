import { call, put } from "redux-saga/effects";
import { setApiData, setError, setPostListFromFeed } from "../../actions/actions";
import { request } from "../requests/authReqs";
import { FEED_ROUTES } from "../../../config/apiRoutes";

export function* handleGetUserFeed(action) {
    try {
        const payload = {
            routeObj: FEED_ROUTES.GET_FEED,
            data: action.payload,
            params: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: FEED_ROUTES.GET_FEED.name,
        }
        yield put(setApiData(reduxPayload));
        yield put(setPostListFromFeed(reduxPayload));
    } catch (error) {
        yield put(setError(error));
    }
}