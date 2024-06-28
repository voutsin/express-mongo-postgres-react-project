import ActionTypes from "./actionTypes";

export const login = credentials => ({
    type: ActionTypes.LOGIN,
    payload: credentials
});

export const logout = () => ({
    type: ActionTypes.LOGOUT
});

export const verifyUser = () => ({
    type: ActionTypes.VERIFY
});

export const setError = (error) => {
    return {
        type: ActionTypes.SET_ERROR,
        payload: {
            error
        }
    }
}

export const setUserTokens = response => {
    return {
        type: ActionTypes.SET_USER_TOKENS,
        payload: {
            response
        }
    }
}

export const registerUser = data => ({
    type: ActionTypes.REGISTER_USER,
    payload: data
});

export const clearData = stateValues => ({
    type: ActionTypes.CLEAR_DATA,
    payload: stateValues
});

export const notify = (message, type) => ({
    type: ActionTypes.NOTIFY,
    payload: {message, type}
});

export const clearNotify = () => ({
    type: ActionTypes.CLEAR_NOTIFY,
});

export const setApiData = data => ({
    type: ActionTypes.SET_API_DATA,
    payload: data
})