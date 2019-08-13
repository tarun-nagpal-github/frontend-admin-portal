import { put, takeLatest, call } from "redux-saga/effects";
import { fetchList } from "../../services/GraphqlListService";

function* fetchListGraphQl(payload = null) {
  const response = yield call(fetchList, payload);
  try {
    switch (response.status) {
      case 200:
        yield put({
          type: "GRAPHQL_SUCCESS",
          success: true,
          status: response.status,
          data: response.data.data.receipts
        });
        break;
      case 400:
        yield put({
          type: "GRAPHQL_FAILED",
          failed: true,
          status: response.status,
          data: response.data.data,
          errors: response.data.errors
        });
        break;
      case 401:
        yield put({
          type: "TOKEN_EXPIRE",
          failed: true,
          status: response.status,
          data: response.data.data,
          message: response.message
        });
        break;
      default:
        yield put({ type: "SERVER_FAILED", serverFailed: true });
        break;
    }
  } catch (error) {
  }
}

export function* actionWatchersGraphQlList() {
  yield takeLatest("FETCH_GRAPHQL", fetchListGraphQl);
}
