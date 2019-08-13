const DEFAULT = {
    data : null,
    errors : null,
    status : null
}
const permissionsReducer = (state = DEFAULT, action) => {
    switch (action.type) {
        case "FETCH_MODULES":
            return {
                ...state
            };
        case "FETCH_MODULES_SUCCESS":
            return {
                ...state,
                data: action.data,
                status: action.status                
            };
        case "FETCH_MODULES_FAILED":
            return {
                ...state,
                errors: action.errors,
                status: action.status                
            };
        case "FETCH_MODULES_RESET":
            return DEFAULT;
        default:
            return state;
    }
} 
export default permissionsReducer;