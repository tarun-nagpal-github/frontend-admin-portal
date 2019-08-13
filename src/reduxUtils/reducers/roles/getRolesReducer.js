const NEW_STATE = {
  data: null,
  status: null,
  errors: null,
  roles: []
};

const getRolesReducer = (state = NEW_STATE, action) => {
  switch (action.type) {
    case "GET_ROLE":
      return {
        ...state
      };
    case "GET_ROLE_SUCCESS":
      return {
        data: action.data,
        status: action.status,
        roles: action.data.roles,
        ...state
      };
    case "GET_ROLE_FAILED":
      return {
        data: action.data,
        errors: action.errors,
        ...state
      };
    case "SERVER_FAILED":
      return {
        data: action.data,
        errors: action.errors,
        ...state
      };
    default:
      return state;
  }
};

export default getRolesReducer;
