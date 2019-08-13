

const DEFAULT = {
    data : null,
    errors : null,
    status : null
}
const savePermissionsReducer = (state = DEFAULT, action) => {
    switch (action.type) {
        case "SAVE_PERMISSIONS":
            return {
                ...state
            };
        case "SAVE_PERMISSIONS_SUCCESS": 
            return {
                ...state, 
                status: action.status                
            };
        case "SAVE_PERMISSIONS_FAILED":
            return {
                ...state,
                errors: action.errors,
                status: action.status                
            };
        case "SAVE_PERMISSIONS_RESET":
            return DEFAULT;
        default:
            return state;
    }
} 
export default savePermissionsReducer;