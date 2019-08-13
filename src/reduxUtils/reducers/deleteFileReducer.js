const INITIAL_STATE = {
  recieptDetails: null,
  deleteSuccess: null,
  status: null,
  message: null
};

const deleteFileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "DELETE_FILE":
      return {
        ...state,
        idReceiving: action.idReceiving
      };
    case "DELETE_FILE_SUCCESS":
      return {
        ...state,
        deleteSuccess: true,
        status: action.status,
        message: action.message,
      };
    case "DELETE_FILE_FAILED":
      return {
        ...state,
        deleteSuccess: false,
        status: action.status,
        message: action.message,
      };

    case "DELETE_FILE_RESET":
      return {
        ...state,
        deleteSuccess: null,
        status: null,
        message: null
      };
    default:
      return state;
  }
};

export default deleteFileReducer;
