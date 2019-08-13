const INITIAL_STATE = {
    status: null,
    data: null,
    errors: null,
    message: null
  };
  
  const serialItemsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "SERIAL_ITEMS_RESET":
        return INITIAL_STATE;

      case "ADD_SERIAL_ITEMS" || "UPDATE_SCANNED_ITEMS":
        return {
          ...state
        };
      case "SERIAL_ITEMS_SUCCESS":
        return {
          ...state,
          status: action.status,
          data: action.data,
          message: action.message
        };
      case "UPDATE_SCANNED_ITEMS_SUCCESS":
        return{
          ...state,
          status: action.status,
          data: action.data,
          message: action.message
        }
      case "UPDATE_SCANNED_ITEMS_FAILED":
        return{
          ...state,
          status: action.status,
          data: action.data,
          message: action.message,
          errors: action.errors
        }
      case "SERIAL_ITEMS_FAILED":
        return {
          ...state,
          status: action.status,
          data: action.data,
          message: action.message,
          errors: action.errors
        };
      case "SERVER_FAILED":
        return {
          ...state,
          status: null,
          data: null,
          message: null
        };
      case "TOKEN_EXPIRE":
        return {
            ...state,
            status: action.status,
            data: action.data,
            message: action.message,
            errors: action.errors
        }
      default:
        return state;
    }
  };
  
  export default serialItemsReducer;
  