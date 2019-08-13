const INITIAL_STATE = {
  recieptDetails: null,
  uploadSuccess: null,
  status: null,
  response: null,
  idReceiving: 0,
  tagNumber: 0
};

const uploadFileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "UPLOAD_FILE":
      return {
        ...state
      };
    case "UPLOAD_FILE_SUCCESS":
      return {
        ...state,
        uploadSuccess: true,
        status: action.status,
        response: action.response,
        tagNumber: action.tagNumber,
        idReceiving: action.idReceiving,
      };
    case "UPLOAD_FILE_FAILED":
      return {
        ...state,
        uploadSuccess: false,
        status: action.status,
        response: action.response,
      };

    case "UPLOAD_FILE_RESET":
      return {
        ...state,
        uploadSuccess: null,
        status: null,
        response: null
      };
    default:
      return state;
  }
};

export default uploadFileReducer;
