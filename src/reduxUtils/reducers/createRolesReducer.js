const INITIAL_STATE = {
  serverFailed: null,
  status: null,
  errors: null
};

const createRolesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "CREATE_ROLE_RESET":
      return INITIAL_STATE;

    case "CREATE_ROLE":
      return {
        ...state
      };
    case "CREATE_ROLE_SUCCESS":
      return {
        ...state,
        status: action.status,
      };
    case "CREATE_ROLE_FAILED":
      return {
        ...state,
        errors: action.errors,
        status: action.status,
      };
    case "SERVER_FAILED":
      return {
        ...state,
        serverFailed: true,
        status: action.status,
      };

    default:
      return state;
  }
};

export default createRolesReducer;
