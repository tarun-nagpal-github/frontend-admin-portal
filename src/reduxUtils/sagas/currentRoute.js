import { put, takeLatest, call } from "redux-saga/effects";

function* setCurrentRoute(state = null){
    let currentUrl = state.payload.split('/');
    yield put({
        type: "CURRENT_ROUTE",
        currentPage: currentUrl[1]
    });
}

export function* actionWatchersCurrentRoute() {
    yield takeLatest("SET_CURRENT_ROUTE", setCurrentRoute);
}