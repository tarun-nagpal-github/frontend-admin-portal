/**
 * GraphQL Service - Global Service to hit an api
 */

import Axios from "axios";
import endpoint from '../config/endpoints';
const API_ENDPOINT = endpoint.GRAPHQL_URL;
import { getMissingPartQuery } from "./queries/MissingPartNum";
import { AxiosErrorHandler } from "../utils/AxiosErrorHandler";

export const fetchList = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      "Authorization": "Bearer " + request.payload.authToken
    }
  }
  const itemsToAdd = {
    query: getMissingPartQuery,
    variables: {
      params: request.payload.metaRequest,
    }
  }
  return Axios.post(API_ENDPOINT, itemsToAdd, config).catch(AxiosErrorHandler);
};

