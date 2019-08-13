import { put, takeLatest, call } from "redux-saga/effects";
import { forgotPasswordAPI, resetPasswordAPI, changePasswordAPI } from "../../services/Auth";

function* forgot_password(payload = null) {
  const response = yield call(forgotPasswordAPI, payload);
  switch (response.status) {
    case 200:
      yield put({
        type: "FORGOT_PASSWORD_SUCCESS",
        success: true,
        status: response.status,
        data: response.data.orphanlist,
        message: response.message
      });
      break;
    case 400:
      yield put({
        type: "FORGOT_PASSWORD_FAILED",
        failed: true,
        status: response.status,
        data: response.data,
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
      yield put({
        type: "SERVER_FAILED",
        serverFailed: true,
        status: response.status,
        message: response.message
      });
      break;
  }
}

function* reset_password(payload = null) {
  const response = yield call(resetPasswordAPI, payload);

  switch (response.status) {
    case 200:
      yield put({
        type: "RESET_PASSWORD_SUCCESS",
        status: response.status,
        message: response.message
      });
      break;
    case 400:
      yield put({
        type: "RESET_PASSWORD_FAILED",
        failed: true,
        status: response.status,
        message: response.message,
        errors: response.data.errors
      });
      break;
    case 401:
      yield put({
        type: "TOKEN_EXPIRE",
        status: response.status,
        message: response.message
      });
      break;
    default:
      yield put({
        type: "SERVER_FAILED",
        serverFailed: true,
        status: response.status
      });
      break;
  }
}

function* change_password(payload = null) {
  const response = yield call(changePasswordAPI, payload);
  switch (response.status) {
    case 200:
      yield put({
        type: "CHANGE_PASSWORD_SUCCESS",
        status: response.status,
        message: response.data.message
      });
      break;
    case 400:
      yield put({
        type: "CHANGE_PASSWORD_FAILED",
        failed: true,
        status: response.status,
        message: response.message,
        errors: response.data.errors
      });
      break;
    case 401:
      yield put({
        type: "TOKEN_EXPIRE",
        status: response.status,
        message: response.message
      });
      break;
    default:
      yield put({
        type: "SERVER_FAILED",
        serverFailed: true,
        status: response.status
      });
      break;
  }
}

export function* actionWatchersForgotPassword() {
  yield takeLatest("FORGOT_PASSWORD", forgot_password);
}

export function* actionWatchersResetPassword() {
  yield takeLatest("RESET_PASSWORD", reset_password);
}

export function* actionWatchersChangePassword() {
  yield takeLatest("CHANGE_PASSWORD", change_password);
}