import Axios from "axios";
import endpoint from '../config/endpoints';
const API_ENDPOINT = endpoint.GRAPHQL_URL;
import { ToolTip } from "../config/graphqlQuery";
import { AxiosErrorHandler } from "../utils/AxiosErrorHandler.js";
import "babel-polyfill";

export const getTooltip = (request) => {
    var itemToAdd = {
        query: ToolTip(request.payload)
    };
    return Axios.post(API_ENDPOINT, itemToAdd)
        .catch(AxiosErrorHandler);
};