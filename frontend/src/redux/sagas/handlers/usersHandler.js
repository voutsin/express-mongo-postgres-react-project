import { call, put } from "redux-saga/effects";
import { notify, setError } from "../../actions/actions";
import { multiPartRequest, request } from "../requests/authReqs";
import { AUTH_ROUTES, USERS_ROUTES } from "../../../config/apiRoutes";
import ActionTypes from "../../actions/actionTypes";
import { NotifyTypes } from "../../../common/enums";


export function* handleUserRegistration(action) {
    try {
        const payload = {
            routeObj: AUTH_ROUTES.REGISTER_USER,
            data: {...action.payload.finalBody, profilePictureUrl: null},
            params: false
        };
        yield call(request, payload);

        const fd = new FormData();
        fd.append('profile_pic', action.payload.file)
        const picPayload = {
            routeObj: USERS_ROUTES.EDIT_PROF_PIC,
            data: fd,
            params: false
        };
        const response = yield call(multiPartRequest, picPayload);
        const { data } = response;
        const updatedPayload = {
            data: data[0] && data[0].user,
            apiSuccess: true,
            apiRouteName: AUTH_ROUTES.REGISTER_USER.name,
        }
        yield put({ 
            type: ActionTypes.REGISTER_USER_RESPONSE, 
            payload: updatedPayload 
        });
    } catch (error) {
        yield put(setError(error));
        const errors = error.response.data.errors;
        const errorMessage = errors.map(err => err.msg).join(', <br/>');
        yield put(notify(errorMessage, NotifyTypes.ERROR));
    }
}