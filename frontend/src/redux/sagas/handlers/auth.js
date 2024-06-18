import { call, put } from "redux-saga/effects";
import { request } from "../requests/authReqs";
import { logout, setError, setUserTokens } from "../../actions/actions";
import { AUTH_ROUTES } from "../../../config/apiRoutes";

export function* handleUserLogin(action) {
    try {
        const payload = {
            routeObj: AUTH_ROUTES.LOGIN,
            data: action.payload,
            params: false
        };
        const response = yield call(request, payload);
        const {data} = response;

        yield put(setUserTokens(data));
    } catch (error) {
        yield put(logout());
        yield put(setError(error));
    }
}