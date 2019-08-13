const INITIAL_STATE = {
  status: null,
  data: null,
  message: null
};

const missingPartNumReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "RESOLVE_MISSING_PART_NUM":
      return {
        ...state
      };
    case "RESOLVE_MISSING_PART_NUM_SUCCESS":
      return {
        ...state,
        status: action.status,
        data: action.data,
        message: action.message
      };
    case "RESOLVE_MISSING_PART_NUM_FAILED":
      return {
        ...state,
        status: action.status,
        data: action.data,
        message: action.message,
        errors: action.errors
      };
    case "RESOLVE_MISSING_PART_NUM_RESET":
      return {
        ...state,
        status: null,
        data: null,
        message: null
      };
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

export default missingPartNumReducer;
