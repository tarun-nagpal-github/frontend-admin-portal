const INITIAL_STATE = {
    status: null,
    data: null,
    errors: null,
    message: null
};

const receivingQueueReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "RECEIVING_QUEUE_M2M_RESET":
            return INITIAL_STATE;

        case "RECEIVING_QUEUE_M2M":
            return {
                ...state
            };
        case "RECEIVING_QUEUE_M2M_SUCCESS":
            return {
                ...state,
                data: action.data,
                status: action.status,
                message: action.message
            };
        case "RECEIVING_QUEUE_M2M_FAILED":
            return {
                ...state,
                data: action.data,
                status: action.status,
                errors: action.errors
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

export default receivingQueueReducer;