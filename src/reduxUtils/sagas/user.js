import { put, takeLatest, call } from "redux-saga/effects";
import { CreateUserService, GetUserDetailsServive, DeleteUserService, EditUserServive } from "../../services/CreateUser";
import { GetUsers } from "../../services/GenericService"



function* createUser(payload = null) {
  try {
    const response = yield call(CreateUserService, payload);
    // on success
    if (response.data.status == 200) {
      yield put(
        {
          type: "CREATE_USER_SUCCESS",
          successResponse: true,
          status: response.data.status,
          data: response.data.data,
          msg: response.data.message
        }
      );
    }
  } catch (error) {
    // on server request error
    if (error.response.status == 400) {
      yield put(
        {
          type: "CREATE_USER_FAILED",
          userFailed: true,
          status: error.response.data.status,
          data: [],
          errorList: error.response.data.errors
        }
      );
    }

    // on server error
    if (error.response.status == 401) {
      yield put(
        {
          type: "TOKEN_EXPIRE",
          serverFailed: true,
          status: error.response.status,
          data: error.response.data
        }
      );
    }
  }
}

function* updateUser(payload = null) {
  try {
    const response = yield call(EditUserServive, payload);
    switch (response.status) {
      case 200:
        yield put({
          type: "UPDATE_USER_SUCCESS",
          status: response.status,
          data: response.data.data
        });
        break;
      case 400:
        yield put({
          type: "UPDATE_USER_FAILED",
          status: response.data.status,
          errors: response.data.errors
        });
        break;
      case 401:
        yield put({
          type: "TOKEN_EXPIRE",
          status: response.data.status,
          errors: response.data.errors
        });
        break;
      default:
        yield put({ type: "SERVER_FAILED", serverFailed: true });
        break;
    }
  } catch (error) {
    yield put({ type: "SERVER_FAILED", error });
  }
}

function* getUser(payload = null) {
  try {
    const response = yield call(EditUserServive, payload);
    switch (response.status) {
      case 200:
        yield put({
          type: "GET_USER_SUCCESS",
          status: response.status,
          data: response.data.data
        });
        break;
      case 400:
        yield put({
          type: "GET_USER_FAILED",
          status: response.data.status,
          errors: response.data.errors
        });
        break;
      case 401:
        yield put({
          type: "TOKEN_EXPIRE",
          status: response.data.status,
          errors: response.data.errors
        });
        break;
      default:
        yield put({ type: "SERVER_FAILED", serverFailed: true });
        break;
    }
  } catch (error) {
    yield put({ type: "SERVER_FAILED", error });
  }
}

function* getUserMetaInfo(payload = null) {
  try {
    const response = yield call(GetUserDetailsServive, payload);
    switch (response.status) {
      case 200:
        yield put(
          {
            type: "GET_USER_META_INFO_SUCCESS",
            successResponse: true,
            status: response.data.status,
            response: response.data.data[0],
            msg: response.data.message
          }
        );
        break;
      case 400:
        yield put(
          {
            type: "GET_USER_META_INFO_FAILED",
            userFailed: true,
            status: error.response.data.status,
            data: [],
            errorList: error.response.data.errors
          }
        );
        break;
      case 401:
        yield put({
          type: "TOKEN_EXPIRE",
          status: response.data.status,
          errors: response.data.errors
        });
        break;
      default:
        yield put({ type: "SERVER_FAILED", serverFailed: true });
        break;
    }    
  } catch (error) {
    // on server request error
    console.log(error);
  }
}

function* getUsersList(request = null) {
  const response = yield call(GetUsers, request.payload);
  switch (response.status) {
    case 200:
      yield put({
        type: "GET_USERS_SUCCESS",
        status: response.status,
        message: response.message,
        data: response.data.data
      });
      break;
    case 400:
      yield put({
        type: "GET_USERS_FAILED",
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

function* deleteUsers(payload = null) {
  try {
    const response = yield call(DeleteUserService, payload);
    // on success
    if (response.data.status == 200) {
      yield put(
        {
          type: "DELETE_USER_SUCCESS",
          successResponse: true,
          status: response.data.status,
          data: response.data.data,
          msg: response.data.message
        }
      );
    }
  } catch (error) {
    // on server request error
    if (error.response.status == 400) {
      yield put(
        {
          type: "DELETE_USER_FAILED",
          userFailed: true,
          status: error.response.data.status,
          data: [],
          errorList: error.response.data.errors
        }
      );
    }

    // on server error
    if (error.response.status == 401) {
      yield put(
        {
          type: "TOKEN_EXPIRE",
          serverFailed: true,
          status: error.response.status,
          data: error.response.data
        }
      );
    }
  }
}

export function* actionWatchersCreateUser() {
  yield takeLatest("CREATE_USER", createUser);
}

export function* actionWatchersUpdateUser() {
  yield takeLatest("UPDATE_USER", updateUser);
}

export function* actionWatchersGetUser() {
  yield takeLatest("GET_USER", getUser);
}

export function* actionWatchersDeleteUser() {
  yield takeLatest("DELETE_USERS", deleteUsers);
}

export function* actionWatchersGetUserInfo() {
  yield takeLatest("GET_USER_META_INFO", getUserMetaInfo);
}

export function* actionWatchersGetUsers() {
  yield takeLatest("GET_USERS", getUsersList);
}
