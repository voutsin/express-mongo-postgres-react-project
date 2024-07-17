import { call, put } from "redux-saga/effects";
import { request } from "../requests/authReqs";
import { setError, setMessageGroupData } from "../../actions/actions";
import { MESSAGE_ROUTES } from "../../../config/apiRoutes";

export function* handleGetUserMessageGroups() {
    try {
        const payload = {
            routeObj: MESSAGE_ROUTES.FIND_ALL_USER_GROUPS,
            params: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        if (data) {
            yield put(setMessageGroupData(data));
        }
    } catch (error) {
        yield put(setError(error));
    }
}
