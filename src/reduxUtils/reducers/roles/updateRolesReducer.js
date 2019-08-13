const initialState = {
    data: null,
    errors: null,
    status: null,
    serverFailed: null
};

function updateRolesReducer(state = initialState, action) {
    switch (action.type) {
        case "UPDATE_ROLES":
            return {
                ...state,
                data: action.data,
                errors: action.errors,
                status: action.status
            };
        case "UPDATE_ROLES_SUCCESS":
            return {
                ...state,
                data: action.data,
                errors: action.errors,
                status: action.status
            };
        case "UPDATE_ROLES_FAILED":
            return {
                ...state,
                data: action.data,
                errors: action.errors,
                status: action.status
            };
        case "SERVER_FAILED":
            return {
                ...state,
                serverFailed: action.serverFailed,
                status: action.status
            };
        case "UPDATE_ROLES_RESET":
            return initialState;
        default:
            return state;
    }
}

export default updateRolesReducer;
