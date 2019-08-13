import { put, takeLatest, call } from "redux-saga/effects";
import { addPartNumberService } from "../../services/Receiving";

function* addPartNumber(payload = null) {
  const response = yield call(addPartNumberService, payload);


  switch (response.status) {
    case 200:
      yield put({
        type: "ADD_PN_SUCCESS",
        userSuccess: true,
        status: response.data.status,
        data: response.data.data,
        msg: response.data.message
      });
      break;
    case 400:
      yield put({
        type: "ADD_PN_FAILED",
        userFailed: true,
        status: response.data.status,
        data: [],
        msg: response.data.message,
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
  // TODO - code references
  // try {
  //   const response = yield call(addPartNumberService, payload);

  //   // on success
  //   if (response.data.status == 200) {
  //     yield put({
  //       type: "ADD_PN_SUCCESS",
  //       userSuccess: true,
  //       status: response.data.status,
  //       data: response.data.data,
  //       msg: response.data.message
  //     });
  //   }
  //   if (response.data.status == 400) {
  //     yield put({
  //       type: "ADD_PN_FAILED",
  //       userFailed: true,
  //       status: response.data.status,
  //       data: [],
  //       msg: response.data.message
  //     });
  //   }
  // } catch (error) {
  //   // on server request error
  //   if (error.response.status == 400) {
  //     yield put({
  //       type: "ADD_PN_FAILED",
  //       userFailed: true,
  //       status: error.response.data.status,
  //       data: [],
  //       errorList: error.response.data.errors
  //     });
  //   }

  //   // on server error
  //   if (error.response.status == 401) {
  //     yield put({
  //       type: "SERVER_FAILED",
  //       serverFailed: true,
  //       status: error.response.status,
  //       data: error.response.data
  //     });
  //   }
  // }
}

export default function* actionWatchersAddPartNumber() {
  yield takeLatest("ADD_PART_NUMBER", addPartNumber);
}