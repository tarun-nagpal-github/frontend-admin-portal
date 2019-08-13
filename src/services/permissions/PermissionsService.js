import Axios from "axios";
import endpoint from '../../config/endpoints';
import { AxiosErrorHandler } from "../../utils/AxiosErrorHandler";
const API_ENDPOINT = endpoint.USER_URL;
export const SavePermissions = request => {
    let config = {
      headers: {
        "Content-Type": "application/json-patch+json",
        Authorization: "Bearer " + request.payload.authToken
      }
    };  

    const itemToAdd = {        
        idUserRole: request.payload.idUserRole,        
        actionsViewModels: request.payload.actionsViewModels
    }; 
    return Axios.post(API_ENDPOINT + "user/createUserActionPermission", itemToAdd, config).catch(AxiosErrorHandler);
  };