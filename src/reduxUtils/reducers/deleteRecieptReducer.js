const INITIAL_STATE = {
  recieptDetails: null,
  deleteSuccess: null,
  status: null,
  message: null
};

const deleteRecieptReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "DELETE_RECIEPT":
      return {
        ...state,
        idReceiving: action.idReceiving
      };
    case "DELETE_RECIEPT_SUCCESS":
      return {
        ...state,
        deleteSuccess: true,
        status: action.status,
        message: action.message,
      };
    case "DELETE_RECIEPT_FAILED":
      return {
        ...state,
        deleteSuccess: false,
        status: action.status,
        message: action.message,
      };

    case "DELETE_RECIEPT_RESET":
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

export default deleteRecieptReducer;
