import { put, takeLatest, call } from "redux-saga/effects";
import { createReceivingService, closeReceivingService, editRecieptService, deleteRecieptService, GetReciepts, partNumService } from "../../services/Receiving";

function* createReceiving(payload = null) {
  try {
    const response = yield call(createReceivingService, payload);
    switch (response.status) {
      case 200:
        yield put({
          type: "CREATE_RECEIVING_SUCCESS",
          userSuccess: true,
          status: response.data.status,
          data: response.data.data,
          message: response.data.message
        });
        break;
      case 400:
        yield put({
          type: "CREATE_RECEIVING_FAILED",
          failed: true,
          status: response.data.status,
          data: response.data.data,
          message: response.data.message,
          errors: response.data.errors
        });
        break;
      case 401:
        yield put({
          type: "TOKEN_EXPIRE",
          failed: true,
          status: response.data.status,
          data: response.data.data,
          message: response.data.message
        });
        break;
      default:
        yield put({ type: "SERVER_FAILED", serverFailed: true });
        break;
    }
  } catch (error) {

  }
}



function* closeReceiving(payload = null) {
  const response = yield call(closeReceivingService, payload);
  switch (response.status) {
    case 200:
      yield put({
        type: "CLOSE_RECEIVING_SUCCESS",
        userSuccess: true,
        status: response.status,
        data: response.data.data,
        msg: response.data.message
      });
      break;
    case 400:
      yield put({
        type: "CLOSE_RECEIVING_FAILED",
        userFailed: true,
        status: response.status,
        data: response.data,
        errors: response.data.errors
      });
      break;
    case 401:
      yield put({
        type: "TOKEN_EXPIRE",
        serverFailed: true,
        status: response.status,
        data: response.data
      });
      break;
    default:
      yield put({ type: "SERVER_FAILED", serverFailed: true });
      break;
  }
}

function* editReciept(payload = null) {
  try {
    const response = yield call(editRecieptService, payload);
    if (response.data.status == 200) {
      yield put({
        type: "EDIT_RECIEPT_SUCCESS",
        recieptDetails: response.data.data,
        status: response.data.status
      });
    }
    // on server request error
    if (response.data.status == 400) {
      yield put({
        type: "EDIT_RECIEPT_FAILED",
      });
    }

    // on server error
    if (response.data.status == 401) {
      yield put({
        type: "TOKEN_EXPIRE",

      });
    }

  } catch (error) {
    console.log(error);
  }
}

function* deleteReciept(payload = null) {
  try {
    const response = yield call(deleteRecieptService, payload);

    if (response.status == 200) {
      yield put({
        type: "DELETE_RECIEPT_SUCCESS",
        status: response.status,
        message: response.data.message,
      });
    }
    // on server request error
    if (response.status == 400) {
      yield put({
        type: "DELETE_RECIEPT_FAILED",
        status: response.status,
        message: response.data.message,
      });
    }

    // on server error
    if (response.status == 401) {
      yield put({
        type: "TOKEN_EXPIRE",

      });
    }

  } catch (error) {
    console.log("CATCH Response");
    console.log(error);
  }
}

function* getReceivingList(payload = null) {
  try {
    const response = yield call(GetReciepts, payload);
    switch (response.status) {
      case 200:
        yield put({
          type: "RECEIVING_SUCCESS",
          success: true,
          status: response.data.status,
          data: response.data.data.receiptlist,
          message: response.data.message
        });
        break;
      case 400:
      case 500:
        yield put({
          type: "RECEIVING_FAILED",
          failed: true,
          status: response.data.status,
          data: response.data.data,
          message: response.data.message
        });
        break;
      case 401:
        yield put({
          type: "TOKEN_EXPIRE",
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
  catch (error) {
    console.log(error);
  }
}

function* isPartNumExists(payload = null) {
  try {
    const response = yield call(partNumService, payload);
    switch (response.status) {
      case 200:
        yield put({
          type: "CHECK_PART_NUM_M2M_SUCCESS",
          data: response.data.data,
          status: response.status,
          message: response.data.message
        });
        break;
      case 400:
      case 404:
      case 500:
        yield put({
          type: "CHECK_PART_NUM_M2M_FAILED",
          failed: true,
          status: response.status,
          data: response.data.data,
          message: response.data.message,
          errors: response.data.errors
        });
        break;
      case 401:
        yield put({
          type: "TOKEN_EXPIRE",
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
  catch (error) {
    console.log(error);
  }
}

function* keepZone(request = null){
  yield put({
    type: "STORE_ZONE_UPDATE",
    zone: request.payload.zone
  });
}


export function* actionWatchersCreateReceiving() {
  yield takeLatest("CREATE_RECEIVING", createReceiving);
}

export function* actionWatchersCloseReceiving() {
  yield takeLatest("CLOSE_RECEIVING", closeReceiving);
}

export function* actionWatchersEditReciept() {
  yield takeLatest("EDIT_RECIEPT", editReciept);
}

export function* actionWatchersDeleteReciept() {
  yield takeLatest("DELETE_RECIEPT", deleteReciept);
}

export function* actionWatchersGetReceivingList() {
  yield takeLatest("GET_RECEIVING_LIST", getReceivingList);
}

export function* actionWatchersPartNumExists() {
  yield takeLatest("CHECK_PART_NUM_M2M", isPartNumExists);
}

export function* actionWatchersZone() {
  yield takeLatest("STORE_ZONE", keepZone);
}