const INITIAL_STATE = {
  deleteSuccess: null,
  status: null,
  message: null
};

const deleteUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "DELETE_USER":
      return {
        ...state
      };
    case "DELETE_USER_SUCCESS":
      return {
        ...state,
        deleteSuccess: true,
        status: action.status,
        message: action.message,
      };
    case "DELETE_USER_FAILED":
      return {
        ...state,
        deleteSuccess: false,
        status: action.status,
        message: action.message,
      };

    case "DELETE_USERS_RESET":
      return {
        ...state,
        deleteSuccess: null,
        status: null,
        message: null
      };
    default:
      return state;
  }
};

export default deleteUserReducer;
