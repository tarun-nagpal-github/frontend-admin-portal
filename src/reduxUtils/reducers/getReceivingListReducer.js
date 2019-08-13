const INITIAL_STATE = {
    status: null,
    success:null,
    failed: null,
    data: null,
    message: null,
    serverFailed: null
  };
  
  const getReceivingList = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "RESET_ACTION":
        return INITIAL_STATE;

      case "GET_RECEIVING_LIST":
        return {
          ...state
        };
      case "RECEIVING_SUCCESS":
        return {
          ...state,
          data: action.data,
          status: action.status,
          message: action.message,
          success: action.success,
          failed: action.failed
        };
      case "RECEIVING_FAILED":
        return {
          ...state,
          data: action.data,
          status: action.status,
          message: action.message,
          success: action.success,
          failed: action.failed
        };
    case "SERVER_FAILED":
      return {
        ...state,
        failed: action.failed,
        status: action.status,
        data: action.data
      };
  
    default:
        return state;
    }
  };
  
  export default getReceivingList;
  