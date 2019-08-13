import Axios from "axios";
import ENDPOINT from '../config/endpoints.json';
import { AxiosErrorHandler } from "../utils/AxiosErrorHandler.js";
const API_ENDPOINT = ENDPOINT.RECEIVING_URL;
import "babel-polyfill";

export const printLabelSerivce = (request) => {
    let config = {
        headers: {
            "Content-Type": "application/json-patch+json",
            "Authorization": "Bearer " + request.payload.authToken
        }
    }
    let data = {
        "PartNumber": request.payload.partNumber,
        "RevisionNumber": request.payload.revisionNumber
    };

    return Axios.post(API_ENDPOINT + "docs/print/partlabel", data, config).catch(AxiosErrorHandler);
};

export const printPartNumberSerivce = (request) => {
    let config = {
        headers: {
            "Content-Type": "application/json-patch+json",
            "Authorization": "Bearer " + request.payload.authToken
        }
    }
    let data = {
        "partNumber": request.payload.part
    };

    return Axios.post(API_ENDPOINT + "docs/printPartNumber", data, config).catch(AxiosErrorHandler);
};

export const printTaggedReceivingSerivce = (request) => {
    let config = {
        headers: {
            "Content-Type": "application/json-patch+json",
            "Authorization": "Bearer " + request.payload.authToken
        }
    }
    let data = {
        "idReceivingDetails": request.payload.idReceivingDetail
    };

    return Axios.post(API_ENDPOINT + "docs/printTaggedReceiving", data, config).catch(AxiosErrorHandler);
};

export const printTagReceiptSerivce = (request) => {
    let config = {
        headers: {
            "Content-Type": "application/json-patch+json",
            "Authorization": "Bearer " + request.payload.authToken
        }
    }
    let data = {
        tagnumber: request.payload.tagNumber
    };

    return Axios.post(API_ENDPOINT + "docs/print/tagreceipt", data, config).catch(AxiosErrorHandler);
};