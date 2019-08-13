export const create_receiving = state => ({
  type: "CREATE_RECEIVING",
  payload: state
});

export const close_receiving = state => ({
  type: "CLOSE_RECEIVING",
  payload: state
});

export const reset_action = state => ({
  type: "RESET_ACTION"
});

export const add_partnumber = state => ({
  type: "ADD_PART_NUMBER",
  payload: state
});

export const delete_reciept = state => ({
  type: "DELETE_RECIEPT",
  payload: state
});

export const delete_reciept_reset = state => ({
  type: "DELETE_RECIEPT_RESET",
  payload: state
});

export const edit_reciept = state => ({
  type: "EDIT_RECIEPT",
  payload: state
});

export const edit_reciept_reset = state => ({
  type: "EDIT_RECIEPT_RESET",
  payload: state
});

export const fetch_receiving_list = state => ({
  type: "GET_RECEIVING_LIST",
  payload: state
});

export const push_receiving_state = state => ({
  type: "PUSH_RECEIVING_STATE",
  payload: state
});

export const check_part_m2m = state => ({
  type: "CHECK_PART_NUM_M2M",
  payload: state
});

export const reset_part_num = state => ({
  type: "CHECK_PART_NUM_M2M_RESET",
  payload: state
});

export const getReceivingCountAction = state => ({
  type: "RECEIVING_COUNTS",
  payload: state
});