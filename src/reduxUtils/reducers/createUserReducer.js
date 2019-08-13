const INITIAL_STATE = {
  status: null,
  msg: null,
  data: null,
  userSuccess: null,
  userFailed: null,
  errorList: null
};

const createUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "RESET_ACTION":
      return INITIAL_STATE;

    case "USER_RESET_ACTION":
      return INITIAL_STATE;

    case "CREATE_USER":
      return {
        ...state,
        response: action.status
      };

    case "CREATE_USER_SUCCESS":
      return {
        ...state,
        response: action.userSuccess,
        status: action.status,
        data: action.data,
        msg: action.msg
      };

    case "CREATE_USER_FAILED":
      return {
        ...state,
        response: action.userFailed,
        status: action.status,
        data: action.data,
        errorList: action.errors
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

export default createUserReducer;
