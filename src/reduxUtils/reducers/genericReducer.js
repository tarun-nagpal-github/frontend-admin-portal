const INITIAL_STATE = {
    status: null,
    success: null,
    failed: null,
    data: null,
    message: null,
    serverFailed: null
};

const genericReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "RESET_ACTION":
        return INITIAL_STATE;

      case "FETCH_HELPTEXT":
        return {
          ...state
        };
      case "REDUCER_SUCCESS":
        return {
          ...state,
          data: action.data,
          status: action.status,
          message: action.message,
          success: action.success,
          failed: action.failed
        };
      case "REDUCER_FAILED":
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
  
  export default genericReducer;