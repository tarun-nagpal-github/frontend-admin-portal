/*
 * Tagged Receiving Service
*/

// import Axios from "axios";
import ENDPOINT from '../../config/endpoints.json';

const API_ENDPOINT = ENDPOINT.RECEIVING_URL;

export const addSerialItems = request => {
  const itemToAdd = {
    IdReceivingDetails: request.payload.idReceivingDetail,
    type: request.payload.actionType,
    serialNumberList: request.payload.actionType == "save" ? [request.payload.formData] : request.payload.data
  };

  return fetch(API_ENDPOINT + "discrepancy/SaveSerialNumber", {
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
};

export const viewScannedItems = request => {
  const itemToAdd = {
    "idReceivingDetails": request.idReceivingDetails,
    "ContainerId": request.ContainerId
  };

  return fetch(API_ENDPOINT + "discrepancy/view/scanned", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.authToken
    },
    body: JSON.stringify(itemToAdd),
  })
  .then(response => {
    return response.json();
  });
};

export const serialNumberScannedPerBox = request => {
  const itemToAdd = {
    "idReceivingDetails": request.idReceivingDetails,
    "numberOfItemsPerBox": request.serialNumberOfItemsPerBox,
    "numberOfBoxesPerPallet" : request.numberOfBoxesPerPallet
  };

 


  return fetch(API_ENDPOINT + "discrepancy/update/SerialNumbersScannedPerBox", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.authToken
    },
    body: JSON.stringify(itemToAdd),
  })
  .then(response => {
    return response.json();
  });
}