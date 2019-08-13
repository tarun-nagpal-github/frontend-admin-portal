const INITIAL_STATE = {
    receivingWorkflowFlag: false,
    receivingId: null,
    tagNumber: null
};
  
const receivingStateReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "PUSH_STATE":
            return {
                ...state,
                receivingWorkflowFlag: true,
                receivingId: action.receivingId,
                tagNumber: action.tagNumber
            };
        case "RESET_STATE":
            return INITIAL_STATE;
        default:
            return state;
    }
};
  
export default receivingStateReducer;