/*
 * Orphan Service
*/

import Axios from "axios";
import ENDPOINT from '../config/endpoints.json';
import { AxiosErrorHandler } from "../utils/AxiosErrorHandler"
const API_ENDPOINT = ENDPOINT.RECEIVING_URL;

export function getOrphanReceipts(request) {
  const itemToAdd = {
    "StartRowIndex": 0,
    "PageSize": 0,
    "OrderByType": "string",
    "OrderByName": "string"
  };

  return fetch(API_ENDPOINT + "receipt/list/orphan", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.payload.authToken
    },
    body: JSON.stringify(itemToAdd),
  })
    .then(response => {
      return response.json();
    });
}

export const resolveDiscrepancy = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.payload.authToken
    }
  }

  const itemToAdd = {
    ReceivingId: request.payload.receivingId,
    ClientId: request.payload.clientId,
    PackingSlipNumber: request.payload.packingSlipNumber
  };
  return Axios.post(API_ENDPOINT + "discrepancy/orphan", itemToAdd, config).catch(AxiosErrorHandler);

};

export const emailUniqueCheck = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.token
    }
  }
  const itemToAdd = {
    email: request.email
  };

  return Axios.post(API_ENDPOINT + "user/valid/email", itemToAdd, config).catch(AxiosErrorHandler);
};