import { call, put } from "redux-saga/effects";
import { setError, setFeedData, setPostListFromFeed } from "../../actions/actions";
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
        
        if (data) {
            yield put(setFeedData(data));
            yield put(setPostListFromFeed(data));
        }
    } catch (error) {
        yield put(setError(error));
    }
}