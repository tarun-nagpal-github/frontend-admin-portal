import { put, takeLatest, call } from "redux-saga/effects";
import { getReceivingsCount, receivingInM2MService} from "../../../services/workflow/receivingService";

function* receiving_count(request = null) {
    const response = yield call(getReceivingsCount, request.payload);
    if (response.data.receiptWorkflowNotifications == null) {
        yield put({
            type: "RECEIVING_COUNTS_FAILED",
            closeReceiptCount: 0,
            missingPartReceiptCount: 0,
            openReceiptCount: 0,
            orphanReceiptCount: 0,
            readyToMoveCount: 0,
            receivingQueueCount: 0,
            tagReceiptCount: 0,
            totalNotificationCount: 0
        });
    } else {
        yield put({
            type: "RECEIVING_COUNTS_SUCCESS",
            closeReceiptCount: response.data.receiptWorkflowNotifications[0].closeReceiptCount,
            missingPartReceiptCount: response.data.receiptWorkflowNotifications[0].missingPartReceiptCount,
            openReceiptCount: response.data.receiptWorkflowNotifications[0].openReceiptCount,
            orphanReceiptCount: response.data.receiptWorkflowNotifications[0].orphanReceiptCount,
            readyToMoveCount: response.data.receiptWorkflowNotifications[0].readyToMoveCount,
            receivingQueueCount: response.data.receiptWorkflowNotifications[0].receivingQueueCount,
            tagReceiptCount: response.data.receiptWorkflowNotifications[0].tagReceiptCount,
            totalNotificationCount: response.data.receiptWorkflowNotifications[0].totalNotificationCount
        });
    }
}

function* receiving_in_m2m(request = null) {
    const response = yield call(receivingInM2MService, request.payload);
    switch (response.status) {
        case 200:
            yield put({
                type: "RECEIVING_QUEUE_M2M_SUCCESS",
                status: response.status,
                message: response.data.message,
                data: response.data
            });
            break;
        case 400:
            yield put({
                type: "RECEIVING_QUEUE_M2M_FAILED",
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

export function* actionWatchersReceivingCount() {
    yield takeLatest("RECEIVING_COUNTS", receiving_count);
}

export function* actionWatchersReceivingInM2M() {
    yield takeLatest("RECEIVING_QUEUE_M2M", receiving_in_m2m);
}