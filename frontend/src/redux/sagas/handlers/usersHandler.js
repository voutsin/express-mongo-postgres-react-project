import { call, put } from "redux-saga/effects";
import { clearData, notify, setApiData, setError } from "../../actions/actions";
import { multiPartRequest, request } from "../requests/authReqs";
import { AUTH_ROUTES, FRIENDS_ROUTES, USERS_ROUTES } from "../../../config/apiRoutes";
import { NotifyTypes } from "../../../common/enums";


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
        yield put(clearData());
    }
}

export function* handleFindUserFriends(action) {
    try {
        const payload = {
            routeObj: FRIENDS_ROUTES.FIND_USER_FRIENDS,
            data: { id: action.payload },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: FRIENDS_ROUTES.FIND_USER_FRIENDS.name,
        }
        yield put(setApiData(reduxPayload));
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleFindDetailedUserFriends(action) {
    try {
        const payload = {
            routeObj: FRIENDS_ROUTES.FIND_DETAILED_USER_FRIENDS,
            data: { id: action.payload },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: FRIENDS_ROUTES.FIND_DETAILED_USER_FRIENDS.name,
        }
        yield put(setApiData(reduxPayload));
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleFindUserFriendsBirthdays() {
    try {
        const payload = {
            routeObj: FRIENDS_ROUTES.FIND_USER_FRIENDS_BIRTHDAYS,
            params: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: FRIENDS_ROUTES.FIND_USER_FRIENDS_BIRTHDAYS.name,
        }
        yield put(setApiData(reduxPayload));
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleSendFriendRequest(action) {
    try {
        const payload = {
            routeObj: FRIENDS_ROUTES.REQUEST_FRIENDSHIP,
            data: { friendId: action.payload },
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        // const reduxPayload = {
        //     data: data,
        //     apiSuccess: true,
        //     apiRouteName: FRIENDS_ROUTES.REQUEST_FRIENDSHIP.name,
        // }
        // yield put(setApiData(reduxPayload));

        if (data) {
            // find friend and set isFriends: false and isFriendsStatus: '1'
            yield put(notify('Request sent.', NotifyTypes.SUCCESS, {friendId: action.payload}));
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleAcceptFriendRequest(action) {
    try {
        const payload = {
            routeObj: FRIENDS_ROUTES.ACCEPT_FRIENDSHIP,
            data: { friendId: action.payload },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        // const reduxPayload = {
        //     data: data,
        //     apiSuccess: true,
        //     apiRouteName: FRIENDS_ROUTES.ACCEPT_FRIENDSHIP.name,
        // }
        // yield put(setApiData(reduxPayload));

        if (data) {
            // find friend and set isFriends: true and isFriendsStatus: '3'
            yield put(notify('Request accepted.', NotifyTypes.SUCCESS, {friendId: action.payload}));
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleDeleteFriendship(action) {
    try {
        const payload = {
            routeObj: FRIENDS_ROUTES.DELETE_FRIENDSHIP,
            data: { friendId: action.payload },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        // const reduxPayload = {
        //     data: data,
        //     apiSuccess: true,
        //     apiRouteName: FRIENDS_ROUTES.DELETE_FRIENDSHIP.name,
        // }
        // yield put(setApiData(reduxPayload));

        if (data) {
            // find friend and set isFriends: false and isFriendsStatus: null
            yield put(notify('Friendship updated.', NotifyTypes.SUCCESS, {friendId: action.payload}));
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleBlockUser(action) {
    try {
        const payload = {
            routeObj: FRIENDS_ROUTES.BLOCK_FRIEND,
            data: { friendId: action.payload },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        // const reduxPayload = {
        //     data: data,
        //     apiSuccess: true,
        //     apiRouteName: FRIENDS_ROUTES.BLOCK_FRIEND.name,
        // }
        // yield put(setApiData(reduxPayload));

        if (data) {
            // find friend and set isFriends: false and isFriendsStatus: '4'
            yield put(notify('User blocked.', NotifyTypes.SUCCESS, {friendId: action.payload}));
        }
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleFindUserDetails(action) {
    try {
        const payload = {
            routeObj: USERS_ROUTES.FIND_BY_ID,
            data: { id: action.payload },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: USERS_ROUTES.FIND_BY_ID.name,
        }
        yield put(setApiData(reduxPayload));
    } catch (error) {
        yield put(setError(error));
    }
}

export function* handleFindUserMedia(action) {
    try {
        const payload = {
            routeObj: USERS_ROUTES.FIND_USER_MEDIA,
            data: { id: action.payload },
            pathVar: true
        };
        const response = yield call(request, payload);
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: USERS_ROUTES.FIND_USER_MEDIA.name,
        }
        yield put(setApiData(reduxPayload));
    } catch (error) {
        yield put(setError(error));
    }
}
