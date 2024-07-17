import {combineReducers} from "redux";
import { authReducer } from "./authReducer";
import { userReducer } from "./userReducer";
import { apiReducer } from "./apiReducer";
import { chatReducer } from "./chatReducer";

const allReducers = combineReducers({
    auth: authReducer,
    users: userReducer,
    api: apiReducer,
    chat: chatReducer,
});

export default allReducers;