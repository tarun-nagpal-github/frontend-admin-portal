const INITIAL_STATE = {
  status: null,
  msg: null,
  data: null,
  successResponse: null,
  failedResponse: null,
  errors: null,
  serverFailed: null,
  recieptDetails: null
};

  const createReceivingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "RESET_ACTION":
        return INITIAL_STATE;
  
      case "CREATE_RECEIVING":
        return {
          ...state,
          response: action.status
        };
  
      case "CREATE_RECEIVING_SUCCESS":
        return {
          ...state,
          response: action.successResponse,
          status: action.status,
          data: action.data,
          msg: action.msg
        };
  
      case "CREATE_RECEIVING_FAILED":
        return {
          ...state,
          response: action.failedResponse,
          status: action.status,
          data: action.data,
          errors: action.errors
        };
  
      case "SERVER_FAILED":
        return {
          ...state,
          serverFailed: action.serverFailed,
          status: action.status,
          data: action.data
        };
  
      default:
        return state;
    }
  };
  
  export default createReceivingReducer;
  
