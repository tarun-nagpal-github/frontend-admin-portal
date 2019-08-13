import { put, takeLatest, call } from "redux-saga/effects";
import { printLabelSerivce, printPartNumberSerivce, printTaggedReceivingSerivce, printTagReceiptSerivce } from "../../../services/PrintService";

function* print_label(payload = null) {
    const response = yield call(printLabelSerivce, payload);
    switch (response.status) {
        case 200:
            yield put({
                type: "PRINT_LABEL_SUCCESS",
                status: response.status,
                data: response.data.data
            });
            break;
        case 400:
            yield put({
                type: "PRINT_LABEL_FAILED",
                status: response.status,
                errors: response.data.errors
            });
            break;
        case 401:
            yield put({
                type: "TOKEN_EXPIRE",
                failed: true,
                status: response.status,
                errors: response.data.errors
            });
            break;
        default:
            yield put({
                type: "SERVER_FAILED",
                serverFailed: true,
                errors: response.data.errors,
                status: response.status,
            });
            break;
    }
}


function* print_part_number(payload = null) {
    const response = yield call(printPartNumberSerivce, payload);
    switch (response.status) {
        case 200:
            yield put({
                type: "PRINT_PART_NUMBER_SUCCESS",
                status: response.status,
                data: response.data.data
            });
            break;
        case 400:
            yield put({
                type: "PRINT_PART_NUMBER_FAILED",
                status: response.status,
                errors: response.data.errors
            });
            break;
        case 401:
            yield put({
                type: "TOKEN_EXPIRE",
                failed: true,
                status: response.status,
                errors: response.data.errors
            });
            break;
        default:
            yield put({
                type: "SERVER_FAILED",
                serverFailed: true,
                errors: response.data.errors,
                status: response.status,
            });
            break;
    }
}

function* print_tagged_receiving(payload = null) {
    const response = yield call(printTaggedReceivingSerivce, payload);
    switch (response.status) {
        case 200:
            yield put({
                type: "PRINT_TAGGED_RECEIVING_SUCCESS",
                status: response.status,
                data: response.data.data
            });
            break;
        case 400:
            yield put({
                type: "PRINT_TAGGED_RECEIVING_FAILED",
                status: response.status,
                errors: response.data.errors
            });
            break;
        case 401:
            yield put({
                type: "TOKEN_EXPIRE",
                failed: true,
                status: response.status,
                errors: response.data.errors
            });
            break;
        default:
            yield put({
                type: "SERVER_FAILED",
                serverFailed: true,
                errors: response.data.errors,
                status: response.status,
            });
            break;
    }
}

function* print_tag_receipt(payload = null) {
    const response = yield call(printTagReceiptSerivce, payload);
    switch (response.status) {
        case 200:
            yield put({
                type: "PRINT_TAG_RECEIPT_SUCCESS",
                status: response.status,
                data: response.data.data,
                message: response.data.message
            });
            break;
        case 400:
            yield put({
                type: "PRINT_TAG_RECEIPT_FAILED",
                status: response.status,
                errors: response.data.errors
            });
            break;
        case 401:
            yield put({
                type: "TOKEN_EXPIRE",
                failed: true,
                status: response.status,
                errors: response.data.errors
            });
            break;
        default:
            yield put({
                type: "SERVER_FAILED",
                serverFailed: true,
                errors: response.data.errors,
                status: response.status,
            });
            break;
    }
}

export function* actionWatchersPrintLabel() {
    yield takeLatest("PRINT_LABEL", print_label);
}

export function* actionWatchersPrintPartNumber() {
    yield takeLatest("PRINT_PART_NUMBER", print_part_number);
}

export function* actionWatchersPrintTaggedReceiving() {
    yield takeLatest("PRINT_TAGGED_RECEIVING", print_tagged_receiving);
}

export function* actionWatchersPrintTagReceipt() {
    yield takeLatest("PRINT_TAG_RECEIPT", print_tag_receipt);
}
