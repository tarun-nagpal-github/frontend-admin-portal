import { put, takeLatest, call } from "redux-saga/effects";
import { getOrphanReceipts, resolveDiscrepancy } from "../../services/OrphansService";



function* get_orphan_receipts(payload = null) {
  const response = yield call(getOrphanReceipts, payload);
  switch (response.status) {
    case 200:
      yield put({
        type: "ORPHAN_RECEIPT_SUCCESS",
        success: true,
        status: response.status,
        data: response.data.orphanlist,
        message: response.message
      });
      break;
    case 400:
      yield put({
        type: "ORPHAN_RECEIPT_FAILED",
        failed: true,
        status: response.status,
        data: response.data
      });
      break;
    case 401:
      yield put({
        type: "SERVER_FAILED",
        failed: true,
        status: response.status,
        data: response.data,
        message: response.message
      });
      break;
    default:
      yield put({ type: "SERVER_FAILED", serverFailed: true });
      break;
  }
}

function* resolve_discrepancy(payload = null) {
  const response = yield call(resolveDiscrepancy, payload);
  switch (response.status) {
    case 200:
      yield put({
        type: "RESOLVE_DISCREPANCY_SUCCESS",
        status: response.status,
        message: response.message
      });
      break;
    case 400:
      yield put({
        type: "RESOLVE_DISCREPANCY_FAILED",
        failed: true,
        status: response.status,
        errors: response.data.errors
      });
      break;
    case 401:
      yield put({
        type: "SERVER_FAILED",
        status: response.status,
        message: response.message
      });
      break;
    default:
      yield put({ type: "SERVER_FAILED", serverFailed: true });
      break;
  }
}

export function* actionWatchersResolveDiscrepancy() {
  yield takeLatest("RESOLVE_DISCREPANCY", resolve_discrepancy);
}

export function* actionWatchersOrphanReceipts() {
  yield takeLatest("GET_ORPHAN_RECEIPTS", get_orphan_receipts);
}