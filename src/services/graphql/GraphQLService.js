import Axios from "axios";
import endpoint from "../../config/endpoints";
import { AxiosErrorHandler } from "../../utils/AxiosErrorHandler";
// import console = require("console");


export function getDataFromGraphQL(query = '') {

  let data = {
    query: `
      {
        modules{
          idUserModule
          userModuleName
          modulePages{
            idUserModulePage
            pageName
            pageUrl
            actions{
              actionId
              actionUrl
              action
            }      
          }
        }
      }
      `
  };
  return Axios.post(endpoint.GRAPHQL_URL, data).catch(AxiosErrorHandler);
}

export function getPermittedPagesFromGraphQL(payload = '') {
  let data = {
    query: payload.payload.getPermittedPagesQuery
  };
  return Axios.post(endpoint.GRAPHQL_URL, data).catch(AxiosErrorHandler);
}

export function fetchActionsFromGraphQL(payload = '') {
  let data = {
    query: payload.payload.fetchActionsQuery
  };
  return Axios.post(endpoint.GRAPHQL_URL, data).catch(AxiosErrorHandler);
}