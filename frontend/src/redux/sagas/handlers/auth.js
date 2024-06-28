import { call, put } from "redux-saga/effects";
import Cookies from 'js-cookie';
import { request } from "../requests/authReqs";
import { clearData, logout, setError, setUserTokens } from "../../actions/actions";
import { AUTH_ROUTES } from "../../../config/apiRoutes";
import { getDeepProp } from "../../../common/utils";

export function* handleUserLogin(action) {
    try {
        // yield put(clearData());

        const payload = {
            routeObj: AUTH_ROUTES.LOGIN,
            data: action.payload,
            params: false
        };
        const response = yield call(request, payload);
        const {data} = response;

        if (data) {
            yield put(setUserTokens(data));
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleUserVerification(action) {
    try {
        const payload = {
            routeObj: AUTH_ROUTES.VERIFY,
            data: null,
            params: true
        };
        const response = yield call(request, payload);
        let data = null;
        const authenticated = getDeepProp(response, 'data.success');
        if (authenticated) {
          // User is authenticated
          data = {
            data: response.data.authUser,
            success: response.data.success,
          }
        } else {
            throw new Error('user not authenticated');
        }
        yield put(setUserTokens(data));
    } catch (error) {
        yield put(logout());
        yield put(setError(error));
    }
}

export function* handleUserLogout(action) {
    try {
        const payload = {
            routeObj: AUTH_ROUTES.LOGOUT,
            data: null,
            params: true
        };
        yield call(request, payload);
        
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        yield put(clearData());
    } catch (error) {
        yield put(setError(error));
    }
}