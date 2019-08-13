const INITIAL_STATE = {
    status: null,
    data: null,
    errors: null,
    message: null
  };
  
  const viewScannedItems = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "VIEW_SCANNED_ITEMS_RESET":
        return INITIAL_STATE;

      case "VIEW_SCANNED_ITEMS":
        return {
          ...state
        };
      case "VIEW_SCANNED_ITEMS_SUCCESS":
        return {
          ...state,
          status: action.status,
          data: action.data,
          message: action.message
        };
      case "VIEW_SCANNED_ITEMS_FAILED":
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
  
  export default viewScannedItems;