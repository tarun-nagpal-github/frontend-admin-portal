const INITIAL_STATE = {
    status: null,
    data: null,
    errors: null,
    message: null,
    closeReceiptCount: 0,
    missingPartReceiptCount: 0,
    openReceiptCount: 0,
    orphanReceiptCount: 0,
    readyToMoveCount: 0,
    receivingQueueCount: 0,
    tagReceiptCount: 0,
    totalNotificationCount: 0
  };
  
  const receivingCountReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "RECEIVING_COUNTS_RESET":
        return INITIAL_STATE;

      case "RECEIVING_COUNTS":
        return {
          ...state
        };
      case "RECEIVING_COUNTS_SUCCESS":
        return {
          ...state,
          closeReceiptCount: action.closeReceiptCount,
          missingPartReceiptCount: action.missingPartReceiptCount,
          openReceiptCount: action.openReceiptCount,
          orphanReceiptCount: action.orphanReceiptCount,
          readyToMoveCount: action.readyToMoveCount,
          receivingQueueCount: action.receivingQueueCount,
          tagReceiptCount: action.tagReceiptCount,
          totalNotificationCount: action.totalNotificationCount
        };
      case "RECEIVING_COUNTS_FAILED":
        return {
          ...state,
          closeReceiptCount: action.closeReceiptCount,
          missingPartReceiptCount: action.missingPartReceiptCount,
          openReceiptCount: action.openReceiptCount,
          orphanReceiptCount: action.orphanReceiptCount,
          readyToMoveCount: action.readyToMoveCount,
          receivingQueueCount: action.receivingQueueCount,
          tagReceiptCount: action.tagReceiptCount,
          totalNotificationCount: action.totalNotificationCount
        };
      case "TOKEN_EXPIRE":
        return {
            ...state,
            status: action.status,
            data: action.data,
            message: action.message,
            errors: action.errors
        }
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
  
  export default receivingCountReducer;