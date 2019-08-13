const initialState = {
  data: null,
  errors: null,
  statusCode: null
};

function fetchRolesReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_ROLES":
      return {
        ...state,
        data: action.data,
        errors: action.errors,
        statusCode: action.status
      };
    case "FETCH_ROLES_SUCCESS":
      return {
        ...state,
        data: action.data,
        errors: action.errors,
        statusCode: action.status
      };
    case "FETCH_ROLES_FAILED":
      return {
        ...state,
        data: action.data,
        errors: action.errors,
        statusCode: action.status
      };
    case "FETCH_ROLES_RESET":
      return initialState;
    default:
      return state;
  }
}

export default fetchRolesReducer;
