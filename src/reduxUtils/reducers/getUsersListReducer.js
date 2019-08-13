const INITIAL_STATE = {
    status: null,
    data: null,
    errors: null,
    message: null
  };
  
  const getUsersListReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "GET_USERS_RESET":
        return INITIAL_STATE;

      case "GET_USERS":
        return {
          ...state
        };
      case "GET_USERS_SUCCESS":
        return {
          ...state,
          status: action.status,
          data: action.data,
          message: action.message
        };
      case "GET_USERS_FAILED":
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
  
  export default getUsersListReducer;