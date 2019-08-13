import { put, takeLatest, call } from "redux-saga/effects";
import { getDataFromGraphQL, getPermittedPagesFromGraphQL, fetchActionsFromGraphQL } from "../../../services/graphql/GraphQLService";
import { SavePermissions } from "../../../services/permissions/PermissionsService";

function* fetchModules() {
  const response = yield call(getDataFromGraphQL);
  try {
    switch (response.status) {
      case 200:
        yield put({
          type: "FETCH_MODULES_SUCCESS",
          data: response.data.data,
          status: response.status
        });
        break;
      case 400:
        yield put({
          type: "FETCH_MODULES_FAILED",
          errors: response.errors,
          status: response.status
        });
        break;
      case 401:
        yield put({ type: "TOKEN_EXPIRE" });
        break;
      default:
        yield put({
          type: "SERVER_FAILED",
          errors: response.errors,
          status: response.status
        });
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

function* fetchActions(payload = "") {

  const response = yield call(fetchActionsFromGraphQL, payload);
  try {
    switch (response.status) {
      case 200:
        yield put({
          type: "FETCH_ACTIONS_SUCCESS",
          data: response.data.data,
          status: response.status
        });
        break;
      case 400:
        yield put({
          type: "FETCH_ACTIONS_FAILED",
          errors: response.errors,
          status: response.status
        });
        break;
      case 401:
        yield put({ type: "TOKEN_EXPIRE" });
        break;
      default:
        yield put({
          type: "SERVER_FAILED",
          errors: response.errors,
          status: response.status
        });
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

function* savePermissions(payload = null) {
  const response = yield call(SavePermissions, payload);
  try {
    switch (response.status) {
      case 200:
        yield put({
          type: "SAVE_PERMISSIONS_SUCCESS",
          status: response.status
        });
        break;
      case 400:
        yield put({
          type: "SAVE_PERMISSIONS_FAILED",
          errors: response.errors,
          status: response.status
        });
        break;
      case 401:
        yield put({ type: "TOKEN_EXPIRE" });
        break;
      default:
        yield put({
          type: "SERVER_FAILED",
          errors: response.errors,
          status: response.status
        });
        break;
    }
  } catch (error) {
    console.log(error);
  }
}

function* getPermittedPages(payload = null) {
  const response = yield call(getPermittedPagesFromGraphQL, payload);
  try {
    switch (response.status) {
      case 200:
        yield put({
          type: "GET_PERMITTED_PAGES_SUCCESS",
          status: response.status,
          data: response.data.data
        });
        break;
      case 400:
        yield put({
          type: "GET_PERMITTED_PAGES_FAILED",
          errors: response.errors,
          status: response.status
        });
        break;
      case 401:
        yield put({ type: "TOKEN_EXPIRE" });
        break;
      default:
        yield put({
          type: "SERVER_FAILED",
          errors: response.errors,
          status: response.status
        });
        break;
    }
  } catch (error) {
    console.log(error);
  }
}


export function* actionWatchersFetchModules() {
  yield takeLatest("FETCH_MODULES", fetchModules);
}

export function* actionWatchersSavePermissions() {
  yield takeLatest("SAVE_PERMISSIONS", savePermissions);
}

export function* actionWatchersGetPermittedPages() {
  yield takeLatest("GET_PERMITTED_PAGES", getPermittedPages);
}

export function* actionWatchersFetchActions() {
  yield takeLatest("FETCH_ACTIONS", fetchActions);
}

