const INITIAL_STATE = {
    currentPage: null
};
  
const currentRouteReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "CURRENT_ROUTE":
            return {
                ...state,
                currentPage: action.currentPage
            };
        case "RESET_STATE":
            return INITIAL_STATE;
        default:
            return state;
    }
};
  
export default currentRouteReducer;