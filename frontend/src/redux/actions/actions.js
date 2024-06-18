import ActionTypes from "./actionTypes";

export const login = credentials => ({
    type: ActionTypes.LOGIN,
    payload: credentials
});

export const logout = () => ({
    type: ActionTypes.LOGOUT
});

export const setError = (error) => {
    return {
        type: ActionTypes.SET_ERROR,
        payload: {
            error
        }
    }
}

export const setUserTokens = (response) => {
    return {
        type: ActionTypes.SET_USER_TOKENS,
        payload: {
            response
        }
    }
}
