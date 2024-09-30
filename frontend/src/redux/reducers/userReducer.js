
const defaultState = {};

export const userReducer = (state = defaultState, action) => {
    switch(action.type) {
        default:
            return state;
    }
}

//SELECTORS
export const selectUserState = (state) => state;