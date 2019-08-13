const DEFAULT = {
    data : null,
    errors : null,
    status : null,
    permittedPages: null
}
const getPermittedPagesReducer = (state = DEFAULT, action) => {
    switch (action.type) {
        case "GET_PERMITTED_PAGES":
            return {
                ...state
            };
        case "GET_PERMITTED_PAGES_SUCCESS":  

            let permittedPages = (action.data.user)?action.data.user.userModulePages:null
            return {
                ...state,
                data: action.data,
                status: action.status,
                permittedPages:  permittedPages             
            };
        case "GET_PERMITTED_PAGES_FAILED":
            return {
                ...state,
                errors: action.errors,
                status: action.status,
                permittedPages: null                
            };
        case "GET_PERMITTED_PAGES_RESET":
            return DEFAULT;
        default:
            return state;
    }
} 
export default getPermittedPagesReducer;