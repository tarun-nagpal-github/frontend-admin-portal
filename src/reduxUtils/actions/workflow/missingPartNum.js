export const get_orphan_receipts = state => ({
  type: "GET_ORPHAN_RECEIPTS",
  payload: state
});

export const reset_action = state => ({
  type: "RESET_ACTION",
  payload: state
});

export const resolve_missing_part_num = state => ({
  type: "RESOLVE_MISSING_PART_NUM",
  payload: state
});

export const resolve_missing_part_num_reset = state => ({
  type: "RESOLVE_MISSING_PART_NUM_RESET",
  payload: state
});