const INITIAL_STATE = {
    status: null,
    data: null,
    errors: null,
    message: null
  };
  
  const tagReceiptReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "RESET_ACTION":
        return INITIAL_STATE;

      case "PRINT_TAG_RECEIPT":
        return {
          ...state
        };
      case "PRINT_TAG_RECEIPT_SUCCESS":
        return {
          ...state,
          status: action.status,
          data: action.data,
          message: action.message
        };
      case "PRINT_TAG_RECEIPT_FAILED":
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
  
  export default tagReceiptReducer;