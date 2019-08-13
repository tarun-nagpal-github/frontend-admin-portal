export const post_serials = state => ({
    type: "ADD_SERIAL_ITEMS",
    payload: state
});

export const reset_state_serial = state => ({
    type: "SERIAL_ITEMS_RESET"
});

export const view_scanned_items = state => ({
    type: "VIEW_SCANNED_ITEMS",
    payload: state
});

export const reset_view_scanned_items = state => ({
    type: "VIEW_SCANNED_ITEMS_RESET"
});

export const scanned_per_boxes_action = state => ({
    type: "UPDATE_SCANNED_PER_BOX",
    payload: state
});

export const scanned_per_box_reset = state => ({
    type: "SCANNED_ITEMS_PER_BOX_RESET"
});

export const update_scanned_items = state => ({
    type: "UPDATE_SCANNED_ITEMS",
    payload: state
});