const INITIAL_STATE = {
    status: null,
    data: null,
    errors: null,
    message: null
  };
  
  const labelReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "RESET_ACTION":
        return INITIAL_STATE;

      case "PRINT_LABEL":
        return {
          ...state
        };
      case "PRINT_LABEL_SUCCESS":
        return {
          ...state,
          status: action.status,
          data: action.data,
          message: action.message
        };
      case "PRINT_LABEL_FAILED":
        return {
          ...state,
          status: action.status,
          data: action.data,
          message: action.message,
          errors: action.errors
        };
      case "TOKEN_EXPIRE":
        return {
            ...state,
            status: action.status,
            data: action.data,
            message: action.message,
            errors: action.errors
        }
      case "SERVER_FAILED":
        return {
          ...state,
          status: null,
          data: null,
          message: null
        };
  
      default:
        return state;
    }
  };
  
  export default labelReducer;