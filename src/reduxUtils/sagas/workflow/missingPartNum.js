import { put, takeLatest, call } from "redux-saga/effects";
import { resolveMissingPartNum } from "../../../services/workflow/missingPartNumService";

function* resolve_missing_part_num(payload = null) {
  const response = yield call(resolveMissingPartNum, payload);
  switch (response.status) {
    case 200:
      yield put({
        type: "RESOLVE_MISSING_PART_NUM_SUCCESS",
        status: response.status,
        message: response.data.data
      });
      break;
    case 400:
      yield put({
        type: "RESOLVE_MISSING_PART_NUM_FAILED",
        status: response.status,
        errors: response.data.errors
      });
      break;
    case 401:
      yield put({
        type: "TOKEN_EXPIRE",
        failed: true,
        status: response.status,
        errors: response.data.errors
      });
      break;
    default:
      yield put({ type: "SERVER_FAILED", serverFailed: true });
      break;
  }
}

export function* actionWatchersResolveMissingPartNum() {
  yield takeLatest("RESOLVE_MISSING_PART_NUM", resolve_missing_part_num);
}
