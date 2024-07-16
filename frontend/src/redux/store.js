import createSagaMiddleware from '@redux-saga/core';
import {configureStore} from "@reduxjs/toolkit";
import allReducers from './reducers';
import rootSaga from './sagas/saga';

const sagaMiddleware = createSagaMiddleware();

const middleware = (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: false, // Disables redux-thunk
    immutableCheck: false, // Disables the immutable state check middleware
    serializableCheck: false, // Disables the serializable state invariant middleware
}).concat(sagaMiddleware);

const store = configureStore(
    {
        reducer: allReducers,
        middleware: middleware,
        devTools: true
    }
);
sagaMiddleware.run(rootSaga);

export default store;