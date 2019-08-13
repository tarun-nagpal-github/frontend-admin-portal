/**
 * Auth Service - Global Service to expose the authentication methods
 *
 */

import Axios from "axios";
import endpoint from '../config/endpoints';
import { AxiosErrorHandler } from "../utils/AxiosErrorHandler";

const API_ENDPOINT = endpoint.AUTH_URL;
const API_USER = endpoint.USER_URL;

export const loginUserService = request => {
  const itemToAdd = {
    username: request.payload.email,
    password: request.payload.password
  };
  return Axios.post(API_ENDPOINT + "auth/token", itemToAdd)
    .catch(AxiosErrorHandler);
};

export const logoutUserService = request => {
  let finalAuth = "Bearer " + request;
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": finalAuth
    }
  };
  return Axios.get(API_ENDPOINT + "auth/logout", config).catch(AxiosErrorHandler);
};

export function forgotPasswordAPI(request = null) {
  let username = request.payload;
  return Axios.post(
    API_ENDPOINT + "user/forgotpassword",
    { username }
  ).catch(AxiosErrorHandler);
}

export function resetPasswordAPI(request = null) {
  return Axios.post(
    API_ENDPOINT + "user/resetpassword",
    {
      newPassword: request.payload.newPassword,
      confirmNewPassword: request.payload.confirmNewPassword,
      token: request.payload.token
    }
  ).catch(AxiosErrorHandler);
}

export function changePasswordAPI(request = null) {
  let token = "Bearer " + request.payload.authToken;
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": token
    }
  };

  let data = {
    currentPassword: request.payload.currentPassword,
    newPassword: request.payload.newPassword,
    confirmNewPassword: request.payload.confirmPassword
  };
  return Axios.post(
    API_USER + "user/changepassword",
    data, config
  ).catch(AxiosErrorHandler);
}
