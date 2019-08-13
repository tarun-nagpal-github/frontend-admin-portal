const INITIAL_STATE = {
  status: null,
  msg: null,
  data: null,
  response: null
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "RESET_GET_USER_META_INFO":
      return INITIAL_STATE;


    case "GET_USER_META_INFO_SUCCESS":
      return {
        ...state,
        response: action.response,
        status: action.status,
        data: action.data,
        msg: action.msg
      };

    case "GET_USER_META_INFO_FAILED":
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

export default userReducer;
