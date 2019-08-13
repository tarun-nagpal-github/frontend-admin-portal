/*
 * Orphan Service
*/

import Axios from "axios";
import ENDPOINT from '../../config/endpoints.json';
import { AxiosErrorHandler } from "../../utils/AxiosErrorHandler";


const API_ENDPOINT = ENDPOINT.RECEIVING_URL;

export const resolveMissingPartNum = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.payload.authToken
    }
  };

  const itemToAdd = {
    IdReceiving: request.payload.receivingId,
    IdClient: request.payload.clientId,
    IdPool: 2,
    missingParts: request.payload.partNumberList,
  };
  return Axios.post(API_ENDPOINT + "discrepancy/resolve/missingparts", itemToAdd, config).catch(AxiosErrorHandler);
};