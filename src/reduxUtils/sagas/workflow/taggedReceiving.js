import { put, takeLatest, call } from "redux-saga/effects";
import { addSerialItems, viewScannedItems, serialNumberScannedPerBox } from "../../../services/workflow/taggedReceiverService";

function* add_serial_items(payload = null) {
  const response = yield call(addSerialItems, payload);

  switch (response.status) {
    case 200:
      yield put({
        type: "SERIAL_ITEMS_SUCCESS",
        status: response.status,
        message: response.message,
        data: response.data
      });
      break;
    case 400:
      yield put({
        type: "SERIAL_ITEMS_FAILED",
        status: response.status,
        message: response.title,
        errors: response.errors
      });
      break;
    case 401:
      yield put({
        type: "TOKEN_EXPIRE",
        failed: true,
        status: response.status,
        data: response.data
      });
      break;
    default:
      yield put({ type: "SERVER_FAILED", serverFailed: true });
      break;
  }
}

function* update_serial_items(payload = null) {
  const response = yield call(addSerialItems, payload);

  switch (response.status) {
    case 200:
      yield put({
        type: "UPDATE_SCANNED_ITEMS_SUCCESS",
        status: response.status,
        message: response.message,
        data: response.data
      });
      break;
    case 400:
      yield put({
        type: "UPDATE_SCANNED_ITEMS_FAILED",
        status: response.status,
        message: response.title,
        errors: response.errors
      });
      break;
    case 401:
      yield put({
        type: "TOKEN_EXPIRE",
        failed: true,
        status: response.status,
        data: response.data
      });
      break;
    default:
      yield put({ type: "SERVER_FAILED", serverFailed: true });
      break;
  }
}

function* view_scanned_items(request = null) {
  const response = yield call(viewScannedItems, request.payload);

  switch (response.status) {
    case 200:
      yield put({
        type: "VIEW_SCANNED_ITEMS_SUCCESS",
        status: response.status,
        message: response.message,
        data: response.data
      });
      break;
    case 400:
      yield put({
        type: "VIEW_SCANNED_ITEMS_FAILED",
        status: response.status,
        message: response.title,
        errors: response.errors
      });
      break;
    case 401:
      yield put({
        type: "TOKEN_EXPIRE",
        failed: true,
        status: response.status,
        data: response.data
      });
      break;
    default:
      yield put({ type: "SERVER_FAILED", serverFailed: true });
      break;
  }
}

function* scanned_per_box(request = null) {
  const response = yield call(serialNumberScannedPerBox, request.payload);

  switch (response.status) {
    case 200:
      yield put({
        type: "SCANNED_PER_BOX_SUCCESS",
        status: response.status,
        message: response.message,
        data: response.data
      });
      break;
    case 400:
      yield put({
        type: "SCANNED_PER_BOX_FAILED",
        status: response.status,
        message: response.title,
        errors: response.errors
      });
      break;
    case 401:
      yield put({
        type: "TOKEN_EXPIRE",
        failed: true,
        status: response.status,
        data: response.data
      });
      break;
    default:
      yield put({ type: "SERVER_FAILED", serverFailed: true });
      break;
  }
}

export function* actionWatchersTaggedReceivings() {
  yield takeLatest("ADD_SERIAL_ITEMS", add_serial_items);
}

export function* actionWatchersScannedItemsUpdate() {
  yield takeLatest("UPDATE_SCANNED_ITEMS", update_serial_items);
}

export function* actionWatchersViewScannedItems() {
  yield takeLatest("VIEW_SCANNED_ITEMS", view_scanned_items);
}

export function* actionWatchersSerialNumberScannedPBox() {
  yield takeLatest("UPDATE_SCANNED_PER_BOX", scanned_per_box);
}