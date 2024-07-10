import { call, put } from "redux-saga/effects";
import { addNewPostData, clearData, getUserFeed, setApiData, setError } from "../../actions/actions";
import { multiPartRequest } from "../requests/authReqs";
import { FEED_ROUTES, POSTS_ROUTES } from "../../../config/apiRoutes";

export function* handleAddNewPost(action) {
    try {
        const {
            finalBody, file
        } = action.payload;

        const formData = new FormData();
        if (file) {
            formData.append('media_url', file);
        }
        Object.keys(finalBody).forEach(key => {
            formData.append(key, finalBody[key]);
        });

        const postPayload = {
            routeObj: POSTS_ROUTES.ADD_NEW_POST,
            data: formData,
        };
        const response = yield call(multiPartRequest, postPayload);
        
        const { data } = response;
        
        const reduxPayload = {
            data: data,
            apiSuccess: true,
            apiRouteName: POSTS_ROUTES.ADD_NEW_POST.name,
        }
        yield put(setApiData(reduxPayload));
        if (data) {
            yield put(addNewPostData(data));
            yield put(clearData([FEED_ROUTES.GET_FEED.name]));
            yield put(getUserFeed({page: 1, pageSize: 10}));
        }
    } catch (error) {
        yield put(setError(error));
    }
}