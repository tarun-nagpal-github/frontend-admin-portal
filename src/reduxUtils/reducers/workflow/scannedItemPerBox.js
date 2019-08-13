const INITIAL_STATE = {
    status: null,
    data: null,
    errors: null,
    message: null
  };
  
  const scannedItemPerBox = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "SCANNED_ITEMS_PER_BOX_RESET":
        return INITIAL_STATE;

      case "UPDATE_SCANNED_PER_BOX":
        return {
          ...state
        };
      case "SCANNED_PER_BOX_SUCCESS":
        return {
          ...state,
          status: action.status,
          data: action.data,
          message: action.message
        };
      case "SCANNED_PER_BOX_FAILED":
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
  
  export default scannedItemPerBox;