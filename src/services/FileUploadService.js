/**
 * File Upload - Service
 *
 */

import Axios from "axios";
import ENDPOINT from "../config/endpoints.json";
import { AxiosErrorHandler } from "../utils/AxiosErrorHandler.js";
const API_ENDPOINT = ENDPOINT.RECEIVING_URL;
export function fileUpload(payload = null) {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("IdAttachmentType", payload.attachmentType);

  if (payload.IdReceiving == 0 || payload.IdReceiving == null) {
    formData.append("IdCarrier", payload.carrier);
    formData.append("IdContainerType", payload.container);
    // formData.append("ClientId", payload.client);
  } else {
    formData.append("IdReceiving", payload.IdReceiving);
  }
  let config = {
    // prittier-ignore
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: "Bearer " + payload.authToken
    }
  };
  return Axios.post(API_ENDPOINT + "docs/upload", formData, config).catch(AxiosErrorHandler);
}

export function deleteFileAction(payload = null) {
  // prittier-ignore
  const headers = {
    "Content-Type": "application/json-patch+json",
    Authorization: "Bearer " + payload.payload.authToken
  };
  const data = {
    idReceivingAttachments: payload.payload.selectedFile
  };
  return Axios.delete(    
    API_ENDPOINT + "receipt/attachments",
    {
      data,
      headers
    }
  ).catch(AxiosErrorHandler);
}

export const isValidExtension = (oInput, _validFileExtensions = []) => {
  if (oInput.type == "file") {
    var sFileName = oInput.value;
    if (sFileName.length > 0) {
      var blnValid = false;
      for (var j = 0; j < _validFileExtensions.length; j++) {
        var sCurExtension = _validFileExtensions[j];
        if (
          sFileName
            .substr(
              sFileName.length - sCurExtension.length,
              sCurExtension.length
            )
            .toLowerCase() == sCurExtension.toLowerCase()
        ) {
          blnValid = true;
          break;
        }
      }

      if (!blnValid) {
        // alert("Sorry, " + sFileName + " is invalid, allowed extensions are: " + _validFileExtensions.join(", "));
        oInput.value = "";
        return false;
      }
    }
  }
  return true;
};

export const isValidFileSize = (fileSize = null) => {
  return fileSize / 1024 / 1024 > 50 ? false : true;
};

export const validPictureExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];
export const validDocumentExtensions = [
  ".jpg",
  ".jpeg",
  ".bmp",
  ".gif",
  ".png",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx"
];

// PDF, DOC, DOCX, XLS, XLSX
