/**
 * Create Receiving-at-dock Service - Creating users
 *
 */

import Axios from "axios";
import ENDPOINT from '../config/endpoints.json';
const API_ENDPOINT = ENDPOINT.RECEIVING_URL;

export async function GetSupportingPictures(request) {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.authToken
    }
  }
  const itemToAdd = {
    "idReceiving": request.idReceiving,
    "startRowIndex": 0,
    "pageSize": 100,
    "orderByType": "string",
    "orderByName": "string"
  };
  let res = await Axios.post(API_ENDPOINT + "receipt/list/supportingpictures", itemToAdd, config).then(result => {
    return result.data.data.attachmentsresponse;
  }).catch(error => {
    return error.response;
  });
  return res;
};