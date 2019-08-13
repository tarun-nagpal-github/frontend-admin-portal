/**
 * Generic Service - Global Service to hit an api
 */

import Axios from "axios";
import endpoint from '../config/endpoints';
import { AxiosErrorHandler } from "../utils/AxiosErrorHandler";
const API_ENDPOINT = endpoint.USER_URL;

export const GetUsers = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.authToken
    }
  }
  const itemToAdd = {
    startIndex: request.startIndex,
    endIndex: request.endIndex
  };

  return Axios.post(API_ENDPOINT + "user/list", itemToAdd, config).catch(AxiosErrorHandler);
};

export const usernameUniqueCheck = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.token
    }
  }
  const itemToAdd = {
    userName: request.userName
  };

  return Axios.post(API_ENDPOINT + "user/valid/username", itemToAdd, config).catch(AxiosErrorHandler);
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