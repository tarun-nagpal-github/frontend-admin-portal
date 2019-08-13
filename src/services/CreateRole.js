/**
 * Create User Service - Creating users
 *
 */

import Axios from "axios";
import endpoint from "../config/endpoints";
import { getRolesArray } from "../config/graphqlQuery";
import { AxiosErrorHandler } from "../utils/AxiosErrorHandler";

const API_ENDPOINT = endpoint.USER_URL;

export const CreateRoleService = request => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.payload.authToken
    }
  };
  const itemOnCreate = {
    idUserType: request.payload.userType,
    roleName: request.payload.roleName
  };
  return Axios.post(
    API_ENDPOINT + "role/create",
    itemOnCreate,
    config).catch(AxiosErrorHandler);
};

export async function getDataGraphQL(method = "post", query = getRolesArray) {
  let data = {
    query: `
      query UserTypeQuery {
        roles {
          roleId
          roleName
          userType
          isActive
        }
      }
    `
  };
  // let res = await Axios({
  //   url: endpoint.GRAPHQL_URL,
  //   method: method,
  //   data: {
  //     query: `
  //     query UserTypeQuery {
  //       roles {
  //         roleId
  //         roleName
  //         userType
  //       }
  //     }
  //   `
  //   }
  // }).then(result => {
  //   return result.data.data.roles;
  // });

  // return res;

  return Axios.post(endpoint.GRAPHQL_URL, data).catch(AxiosErrorHandler);
}

export const updateRolesService = (request) => {
  let config = {
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + request.payload.authToken
    }
  };
  const itemOnUpdate = {
    idUserType: request.payload.userType,
    role: request.payload.roleName,
    roleId: request.payload.roleId,
    isActive: request.payload.isActive
  };

  return Axios.post(API_ENDPOINT + "role/update",
    itemOnUpdate,
    config
  ).catch(AxiosErrorHandler);
}
