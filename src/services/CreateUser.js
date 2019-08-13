/**
 * Create User Service - Creating users
 *
 */

import Axios from "axios";
import endpoint from '../config/endpoints';
import { AxiosErrorHandler } from "../utils/AxiosErrorHandler";
// import console = require("console");

const API_ENDPOINT = endpoint.USER_URL;
const API_AUTH_ENDPOINT = endpoint.AUTH_URL;

export const CreateUserService = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.payload.authToken
    }
  }

  const itemToAdd = {
    idUserType: 1,
    firstName: request.payload.firstName,
    lastName: request.payload.lastName,
    userName: request.payload.userName,
    idClient: 0,
    userId: 0,
    email: request.payload.email,
    password: request.payload.password,
    pin: request.payload.pin,
    idPool: 5,
    idFulfillmentZone: request.payload.fulfillmentZone,
    changeOnFirstLogin: request.payload.changePassword,
    approverId: 'string',
    backupId: 1,
    idUserRoles: request.payload.assignedRole
  };
  return Axios.post(API_ENDPOINT + "user/create", itemToAdd, config).catch(AxiosErrorHandler);
};

export const EditUserServive = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.payload.authToken
    }
  }

  if(request.payload.actionItem == "get"){
    var itemToAdd = {
      idUser: request.payload.idUser
    }
    var URL = "user/details";
  }

  if(request.payload.actionItem == "update"){
    var itemToAdd = {
      idUser: request.payload.idUser,
      idUserType: 1,
      firstName: request.payload.firstName,
      lastName: request.payload.lastName,
      idClient: 0,
      userId: request.payload.userId,
      email: request.payload.email,
      idPool: 0,
      idFulfillmentZone: request.payload.fulfillmentZone,
      backupId: request.payload.idUser,
      idUserRoles: request.payload.assignedRole
    };
    var URL = "user/edit";
  }
  
  return Axios.post(API_ENDPOINT + URL, itemToAdd, config).catch(AxiosErrorHandler);
};

export const GetUserDetailsServive = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.payload.authToken
    }
  }
  return Axios.get(API_ENDPOINT + "user/info", config).catch(AxiosErrorHandler);
};

export const DeleteUserService = (request) => {
  let headers = {
    "Content-Type": "application/json-patch+json",
    "Authorization": "Bearer " + request.payload.authToken
  }
  let data = {
    "userIds": Object.keys(request.payload.selected)
  };

  return Axios.delete(API_ENDPOINT + "user/delete", { headers, data }).catch(AxiosErrorHandler);
};