/**
 * Create Receiving-at-dock Service - Creating users
 *
 */

import Axios from "axios";
import ENDPOINT from "../config/endpoints.json";
import { AxiosErrorHandler } from "../utils/AxiosErrorHandler.js";
const API_ENDPOINT = ENDPOINT.RECEIVING_URL;
const STORE_ENDPOINT = ENDPOINT.STORE_URL;
import "babel-polyfill";

export const createReceivingService = request => {
  // date assembling
  var receivedOn = dateFactory(request.payload.receivedOn);

  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.payload.authToken
    }
  };

  const itemToAdd = {
    idReceiving: request.payload.receivingId,
    idClient:
      request.payload.client == "none" ? 0 : parseInt(request.payload.client),
    idFulfillmentZone:
      request.payload.zone == "none" ? 0 : parseInt(request.payload.zone),
    idPool: request.payload.pool == "none" ? 0 : parseInt(request.payload.pool),
    tagNumber: "",
    idCarrier: parseInt(request.payload.carrier),
    trackingNumber: request.payload.trackingNumber,
    packingSlipNumber: request.payload.packing,
    idContainerType: parseInt(request.payload.container),
    receivedOn: receivedOn,
    discrepancy: request.payload.discrepancy ? request.payload.discrepancy : [],
    isTrackingNumberRequired: request.payload.carrierIsRequired
  };
  return Axios.post(API_ENDPOINT + "receipt/save", itemToAdd, config).catch(
    AxiosErrorHandler
  );
};

export const closeReceivingService = request => {
  var receivedOn = dateFactory(request.payload.receivedOn);

  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.payload.authToken
    }
  };
  const itemToAdd = {
    idReceiving: request.payload.receivingId,
    idClient:
      request.payload.client == "none" ? 0 : parseInt(request.payload.client),
    idFulfillmentZone:
      request.payload.zone == "none" ? 0 : parseInt(request.payload.zone),
    idPool: request.payload.pool == "none" ? 0 : parseInt(request.payload.pool),
    tagNumber: request.payload.tagNumber,
    idCarrier: parseInt(request.payload.carrier),
    trackingNumber: request.payload.trackingNumber,
    packingSlipNumber: request.payload.packing,
    idContainerType: parseInt(request.payload.container),
    receivedOn: receivedOn,
    isClosed: true,
    discrepancy: request.payload.discrepancy ? request.payload.discrepancy : [],
    isTrackingNumberRequired: request.payload.carrierIsRequired
  };

  return Axios.post(API_ENDPOINT + "receipt/close", itemToAdd, config).catch(
    AxiosErrorHandler
  );

  // return fetch(API_ENDPOINT + "receipt/close", {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json-patch+json",
  //     "Authorization": "Bearer " + request.payload.authToken
  //   },
  //   body: JSON.stringify(itemToAdd),
  // })
  //   .then(response => {
  //     return response.json();
  //   });
};

export const addPartNumberService = request => {
  // date assembling
  var receivedOn = dateFactory(request.payload.receivedOn);

  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.payload.authToken
    }
  };

  const data = {
    idReceiving: request.payload.receivingId,
    idFulfillmentZone:
      request.payload.zone == "none" ? 0 : parseInt(request.payload.zone),
    idClient:
      request.payload.client == "none" ? 0 : parseInt(request.payload.client),
    discrepancy: request.payload.discrepancy ? request.payload.discrepancy : [],
    idPool: request.payload.pool == "none" ? 0 : parseInt(request.payload.pool),
    tagNumber: request.payload.tagNumber,
    idCarrier: parseInt(request.payload.carrier),
    trackingNumber: request.payload.trackingNumber,
    packingSlipNumber: request.payload.packing,
    idContainerType: request.payload.container,
    receivedOn: receivedOn,
    isAvailableInErp: request.payload.pnNotFound == "checked" ? false : true,
    incomingPartNumber: request.payload.part,
    incomingRevisionNumber: request.payload.rev,
    qtyReceived: parseInt(request.payload.qty),
    qtyUom: request.payload.qtyType,
    packageQtyReceived: parseInt(request.payload.pqty),
    // "idPackageSize": "1",
    idPackageSize: request.payload.pqtyType,
    isLabelNeeded: 0,
    labelQuantity: 0,
    lotNumber: request.payload.lot,
    binNumber: request.payload.inspectionValue,
    idReceivingDetail: request.payload.idReceivingDetail
  };

  return Axios.post(API_ENDPOINT + "receipt/parts", data, config).catch(
    AxiosErrorHandler
  );
};
export function GetReciepts(request) {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.payload.authToken
    }
  };
  const itemToAdd = {
    idUser: request.payload.idUser,
    startRowIndex: 0,
    pageSize: 1000,
    orderByType: "",
    orderByName: ""
  };
  return Axios.post(API_ENDPOINT + "receipt/list", itemToAdd, config).catch(
    AxiosErrorHandler
  );
}

export const editRecieptService = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.payload.authToken
    }
  };
  const itemToAdd = {
    idReceiving: request.payload.idReceiving
  };
  return Axios.post(API_ENDPOINT + "receipt/details", itemToAdd, config).catch(
    AxiosErrorHandler
  );
};

export const deleteRecieptService = request => {
  let headers = {
    "Content-Type": "application/json-patch+json",
    Authorization: "Bearer " + request.payload.authToken
  };
  let data = {
    idReceiving: request.payload.selected,
    pin: request.payload.pin
  };
  return Axios.delete(API_ENDPOINT + "receipt/delete", { headers, data })
    .then(response => {
      return response;
    })
    .catch(AxiosErrorHandler);
};

export const getPartNumberList = async request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.authToken
    }
  };
  const data = {
    ReceivingId: request.receivingid
  };

  let res = await Axios.post(
    API_ENDPOINT + "receipt/list/parts",
    data,
    config
  ).catch(AxiosErrorHandler);
  return res;
};

export const deletePartNumber = async request => {
  let headers = {
    "Content-Type": "application/json-patch+json",
    Authorization: "Bearer " + request.authToken
  };

  const data = {
    partsId: [request.partsId]
  };

  let res = await Axios.delete(API_ENDPOINT + "receipt/delete/parts", {
    data,
    headers
  }).catch(AxiosErrorHandler);
  return res;
};

export function partNumService(request) {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.payload.authToken
    }
  };
  const itemToAdd =
  {
    "partNumber": request.payload.part,
    "revisionNumber": request.payload.rev,
    "facility": "",
    "groupCode": request.payload.clientCode
  }
  // {
  //   partNumber: "000761939",
  //   revisionNumber: "0",
  //   facility: "",
  //   groupCode: "KN"
  // };
  /*
{
  "partNumber": "000761939",
  "revisionNumber": "0",
  "facility": "",
  "groupCode": "KN"
}
  */
  return Axios.post(
    STORE_ENDPOINT + "store/part/detail",
    itemToAdd,
    config
  ).catch(AxiosErrorHandler);
}

function dateFactory(fullDate) {
  var d = new Date(fullDate);
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
