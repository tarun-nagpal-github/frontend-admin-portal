const INITIAL_STATE = {
    zone: 0
};

const storeZoneReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case "STORE_RESET_ACTION":
            return INITIAL_STATE;

        case "STORE_ZONE":
            return {
                ...state
            };
        case "STORE_ZONE_UPDATE":
            return {
                ...state,
                zone: action.zone
            }
        default:
            return state;
    }
};

export default storeZoneReducer;