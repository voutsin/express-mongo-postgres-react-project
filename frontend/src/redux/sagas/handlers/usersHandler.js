import { call, put } from "redux-saga/effects";
import { setApiData, setError } from "../../actions/actions";
import { multiPartRequest, request } from "../requests/authReqs";
import { AUTH_ROUTES, USERS_ROUTES } from "../../../config/apiRoutes";


export function* handleUserRegistration(action) {
    try {
        const payload = {
            routeObj: AUTH_ROUTES.REGISTER_USER,
            data: {...action.payload.finalBody, profilePictureUrl: null},
            params: false
        };
        const userResponse = yield call(request, payload);
        let updatedPayload = {}

        if (userResponse.data) {
            updatedPayload = {
                data: userResponse.data,
                apiSuccess: true,
                apiRouteName: AUTH_ROUTES.REGISTER_USER.name,
            }

            if (action.payload.file != null) {
                const fd = new FormData();
                fd.append('profile_pic', action.payload.file)
                const picPayload = {
                    routeObj: USERS_ROUTES.EDIT_PROF_PIC,
                    data: fd,
                    params: false
                };
                const fileResponse = yield call(multiPartRequest, picPayload);

                if (fileResponse.data) {
                    updatedPayload = {
                        ...updatedPayload,
                        data: fileResponse.data[0] && fileResponse.data[0].user,
                    }
                }
            }
        }
    
        yield put(setApiData(updatedPayload));
    } catch (error) {
        yield put(setError(error));
    }
}