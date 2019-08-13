const initialState = {
  data: null,
  errors: null,
  status: null
};

function fetchActionsReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_ACTIONS":
      return {
        ...state
      };
    case "FETCH_ACTIONS_SUCCESS":
      return {
        ...state,
        data: action.data,
        errors: action.errors,
        status: action.status
      };
    case "FETCH_ACTIONS_FAILED":
      return {
        ...state,
        data: action.data,
        errors: action.errors,
        status: action.status
      };
    case "FETCH_ACTIONS_RESET":
      return initialState;
    default:
      return state;
  }
}

export default fetchActionsReducer;
