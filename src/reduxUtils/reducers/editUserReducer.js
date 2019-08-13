const INITIAL_STATE = {
  status: null,
  response: null,
  data: null,
  errors: null,
  loader: false
};

const editUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "GET_USER":
      return {
        ...state,
        loader: true
      };
    case "GET_USER_RESET":
      return {
        ...state,
        status: null,
        response: null,
        data: null,
        errors: null,
        loader: false
      };
    case "GET_USER_SUCCESS":
      return {
        ...state,
        response: action.response,
        status: action.status,
        data: action.data,
        loader: false
      };
    case "GET_USER_FAILED":
      return {
        ...state,
        response: action.response,
        status: action.status,
        errors: action.errors,
        loader: false
      };
    default:
      return state;
  }
};

export default editUserReducer;
