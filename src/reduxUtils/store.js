import { createStore, compose, applyMiddleware } from "redux";
import { logger } from "redux-logger";

import rootSaga from "../reduxUtils/sagas/index";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import masterReducer from "./reducers/masterReducer";
import { composeWithDevTools } from 'redux-devtools-extension';



const numberPersistConfig = {
  key: "persistedStore",
  version: 1,
  storage
};

// const composerEnhancer = composeWithDevTools();
let options = {
  name: `Redux`,
  realtime: true,
  trace: true,
  traceLimit: 25
}



const sagaMiddleware = createSagaMiddleware();
const composeEnhancer = composeWithDevTools(options);
// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION__([options]) || compose; // for chrome debug only
const persistedReducer = persistReducer(numberPersistConfig, masterReducer);

const store = createStore(
  persistedReducer,
  composeEnhancer(applyMiddleware(sagaMiddleware, logger))
);
sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export default store;
