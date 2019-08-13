const INITIAL_STATE = {
  recieptDetails: null,
  status: null,
  loader: null
};

const editReceivingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "EDIT_RECIEPT":
      return {
        ...state,
        loader: true,
        idReceiving: action.idReceiving
      };
    case "EDIT_RECIEPT_SUCCESS":
      return {
        ...state,
        loader: false,
        recieptDetails: action.recieptDetails,
        status: action.status
      };
    case "EDIT_RECIEPT_RESET":
      return {
        ...state,
        loader: false,
        recieptDetails: null,
        status: null
      };

    default:
      return state;
  }
};

export default editReceivingReducer;