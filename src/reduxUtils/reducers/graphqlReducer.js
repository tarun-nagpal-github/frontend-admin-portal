const INITIAL_STATE = {
  status: null,
  success: null,
  failed: null,
  data: null,
  message: null,
  serverFailed: null
};

const graphqlQuery = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "RESET_ACTION":
      return {
        ...state,
        data: null,
        status: null,
        message: null,
        success: null,
        failed: null
      };

    case "FETCH_GRAPHQL":
      return {
        ...state
      };
    case "GRAPHQL_SUCCESS":
      return {
        ...state,
        data: action.data,
        status: action.status,
        success: action.success
      };
    case "GRAPHQL_FAILED":
      return {
        ...state,
        data: action.data,
        status: action.status,
        message: action.message,
        success: action.success,
        failed: action.failed,
        errors: action.errors
      };
    case "TOKEN_EXPIRE":
      return {
        ...state,
        failed: action.failed,
        status: action.status,
        data: action.data,
        message: action.message
      };

    default:
      return state;
  }
};

export default graphqlQuery;
