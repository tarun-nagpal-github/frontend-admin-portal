import { put, takeLatest, call } from "redux-saga/effects";
import { CreateRoleService, getDataGraphQL, updateRolesService } from "../../services/CreateRole";
// import console = require("console");

function* createRole(payload = null) {
  try {
    const response = yield call(CreateRoleService, payload);
    switch (response.status) {
      case 200:
        yield put({
          type: "CREATE_ROLE_SUCCESS",
          status: response.data.status
        });
        break;
      case 400:
        yield put({
          type: "CREATE_ROLE_FAILED",
          status: response.data.status,
          errors: response.data.errors
        });
        break;
      case 401:
        yield put({
          type: "TOKEN_EXPIRE",
          status: response.status,
          data: response.data
        });
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

function* fetchRoles(payload = null) {
  try {
    const response = yield call(getDataGraphQL, payload);
    switch (response.status) {
      case 200:
        yield put({
          type: "FETCH_ROLES_SUCCESS",
          status: response.status,
          data: response.data.data
        });
        break;
      case 400:
        yield put({
          type: "FETCH_ROLES_FAILED",
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

function* updateRoles(payload = null) {
  try {
    const response = yield call(updateRolesService, payload);
    switch (response.status) {
      case 200:
        yield put({
          type: "UPDATE_ROLES_SUCCESS",
          status: response.status,
          data: response.data.data
        });
        break;
      case 400:
        yield put({
          type: "UPDATE_ROLES_FAILED",
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

export function* actionWatchersCreateRole() {
  yield takeLatest("CREATE_ROLE", createRole);
}

export function* actionWatchersFetchRoles() {
  yield takeLatest("FETCH_ROLES", fetchRoles);
}

export function* actionWatchersUpdateRoles() {
  yield takeLatest("UPDATE_ROLES", updateRoles);
}
