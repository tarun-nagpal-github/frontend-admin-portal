import { put, takeLatest, call } from "redux-saga/effects";

function* stateReceiver(state = null){
    yield put({
        type: "PUSH_STATE",
        receivingId: state.payload.receivingId,
        tagNumber: state.payload.tag
    });
}

export function* actionWatchersStateReceiver() {
    yield takeLatest("PUSH_RECEIVING_STATE", stateReceiver);
}