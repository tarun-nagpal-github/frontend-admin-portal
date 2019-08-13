import { put, takeLatest, call } from "redux-saga/effects";
import { getTooltip } from "../../services/ToolTipService";

function* fetchHelpText(payload = null) {
    try {
        const response = yield call(getTooltip, payload);
        switch (response.status) {
            case 200:
                yield put({
                    type: "REDUCER_SUCCESS",
                    success: true,
                    status: response.status,
                    data: response.data.data.lookup
                });
                break;
            case 400:
                yield put({
                    type: "REDUCER_FAILED",
                    failed: true,
                    status: response.status,
                    data: response.data.data,
                    errors: response.data.errors
                });
                break;
            case 401:
                yield put({
                    type: "TOKEN_EXPIRE",
                    failed: true,
                    status: response.status,
                    data: response.data.data,
                    message: response.message
                });
                break;
            default:
                yield put({ type: "SERVER_FAILED", serverFailed: true });
                break;
        }
    } catch (error) {
    }
}

export function* actionWatchersHelpText() {
    yield takeLatest("FETCH_HELPTEXT", fetchHelpText);
}