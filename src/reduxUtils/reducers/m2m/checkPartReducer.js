const INITIAL_STATE = {
  data: null,
  status: null,
  message: null,
  errors: null,
};

const checkPartReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "CHECK_PART_NUM_M2M":
      return {
        ...state
      };
    case "CHECK_PART_NUM_M2M_SUCCESS":
      return {
        ...state,
        status: action.status,
        message: action.message,
        data: action.data
      };
    case "CHECK_PART_NUM_M2M_FAILED":
      return {
        ...state,
        status: action.status,
        message: action.message,
        errors: action.errors,
      };
    case "CHECK_PART_NUM_M2M_RESET":
      return {
        ...state,
        status: null,
        message: null,
        data: null,
        errors: null
      };
    default:
      return state;
  }
};

export default checkPartReducer;
