const INITIAL_STATE = {
  status: null,
  success: null,
  failed: null,
  data: null,
  message: null,
  errors: null,
  serverFailed: null,
  resolveDiscrepancyData: null,
  resolveDiscrepancyStatus: null,
};

const orphanReceiptsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "RESET_ACTION":
      return INITIAL_STATE;

    case "GET_ORPHAN_RECEIPTS":
      return {
        ...state
      };
    case "RESOLVE_DISCREPANCY":
      return {
        ...state
      };
    case "RESOLVE_DISCREPANCY_SUCCESS":
      return {
        ...state,
        resolveDiscrepancyData: action.data,
        resolveDiscrepancyStatus: action.status,
      };
    case "RESOLVE_DISCREPANCY_FAILED":
      return {
        ...state,
        resolveDiscrepancyData: action.data,
        resolveDiscrepancyStatus: action.status,
        errors: action.errors
      };
    case "RESOLVE_DISCREPANCY_RESET":
      return {
        ...state,
        resolveDiscrepancyData: null,
        resolveDiscrepancyStatus: null,
      };
    case "ORPHAN_RECEIPT_SUCCESS":
      return {
        ...state,
        data: action.data,
        status: action.status,
        message: action.message,
        success: action.success,
        failed: action.failed
      };
    case "ORPHAN_RECEIPT_FAILED":
      return {
        ...state,
        data: action.data,
        status: action.status,
        message: action.message,
        success: action.success,
        failed: action.failed
      };
    case "SERVER_FAILED":
      return {
        ...state,
        failed: action.failed,
        status: action.status,
        data: action.data
      };

    default:
      return state;
  }
};

export default orphanReceiptsReducer;
