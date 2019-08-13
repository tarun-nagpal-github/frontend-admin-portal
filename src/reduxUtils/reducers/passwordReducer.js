const INITIAL_STATE = {
  status: null,
  message: null,
  data: null,
  userSuccess: null,
  userFailed: null
};

const passwordReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "RESET_ACTION":
      return INITIAL_STATE;

    case "FORGOT_PASSWORD":
      return {
        ...state,
        response: action.status
      };

    case "FORGOT_PASSWORD_SUCCESS":
      return {
        ...state,
        response: action.userSuccess,
        status: action.status,
        data: action.data,
        message: action.message
      };

    case "FORGOT_PASSWORD_FAILED":
      return {
        ...state,
        response: action.userFailed,
        status: action.status,
        data: action.data,
        errors: action.errors
      };
    case "RESET_PASSWORD_SUCCESS":
      return {
        ...state,
        response: action.userSuccess,
        status: action.status,
        data: action.data,
        message: action.message
      };

    case "RESET_PASSWORD_FAILED":
      return {
        ...state,
        response: action.userFailed,
        status: action.status,
        data: action.data,
        errors: action.errors
      };

    case "CHANGE_PASSWORD_SUCCESS":
      return {
        ...state,
        response: action.userSuccess,
        status: action.status,
        data: action.data,
        message: action.message
      };

    case "CHANGE_PASSWORD_FAILED":
      return {
        ...state,
        response: action.userFailed,
        status: action.status,
        data: action.data,
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
        serverFailed: action.serverFailed,
        status: action.status,
        data: action.data
      };

    default:
      return state;
  }
};

export default passwordReducer;
