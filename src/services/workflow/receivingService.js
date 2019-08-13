/*
 * Receiving Queue and Count Service
*/

import Axios from "axios";
import ENDPOINT from '../../config/endpoints.json';
import { AxiosErrorHandler } from "../../utils/AxiosErrorHandler";
import { receivingCounts } from "../../config/graphqlQuery";

const API_ENDPOINT = ENDPOINT.GRAPHQL_URL;
const API_ENDPOINT_RECEIVING = ENDPOINT.RECEIVING_URL;

export const getReceivingsCount = request => {
    var zoneId = 0;
    if (('zone' in request) && request.zone != null){
        var zoneId = request.zone;
    }
    return fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: receivingCounts(zoneId)
        })
    })
    .then(response => {
        return response.json();
    });
};

export const receivingInM2MService = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.authToken
    }
  };
  const itemToAdd = {
    IdReceiving: request.receivingId
  };
  return Axios.post(API_ENDPOINT_RECEIVING + "receipt/items/receive", itemToAdd, config).catch(AxiosErrorHandler);
};