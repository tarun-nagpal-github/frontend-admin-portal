import { put, takeLatest, call } from "redux-saga/effects";
import { deleteFileAction, fileUpload } from "../../services/FileUploadService";

export function* deleteFile(payload = null) {
  try {
    const response = yield call(deleteFileAction, payload);

    if (response.status == 200) {
      yield put({
        type: "DELETE_FILE_SUCCESS",
        status: response.status,
        message: response.data.message,
      });
    }
    // on server request error
    if (response.status == 400) {
      yield put({
        type: "DELETE_FILE_FAILED",
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
  }
}



export function* uploadFile(payload = null) {
  try {
    const response = yield call(fileUpload, payload);
    if (response.status == 200) {
      yield put({
        type: "UPLOAD_FILE_SUCCESS",
        status: response.status,
        message: response.data.data.message,
        tagNumber: response.data.data.tagnumber,
        idReceiving: response.data.data.receivingid,
      });
    }
    // on server request error
    if (response.status == 400) {
      yield put({
        type: "UPLOAD_FILE_FAILED",
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
  }
}

export function* actionWatchersDeleteFile() {
  yield takeLatest("DELETE_FILE", deleteFile);
}

export function* actionWatchersUploadFile() {
  yield takeLatest("UPLOAD_FILE", uploadFile);
}