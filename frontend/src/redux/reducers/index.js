import {combineReducers} from "redux";
import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { apiReducer } from "./apiReducer";

const allReducers = combineReducers({
    auth: authReducer,
    users: userReducer,
    api: apiReducer
});

export default allReducers;