export const get_orphan_receipts = state => ({
  type: "GET_ORPHAN_RECEIPTS",
  payload: state
});

export const reset_action = state => ({
  type: "RESET_ACTION",
  payload: state
});

export const resolve_discrepancy = state => ({
  type: "RESOLVE_DISCREPANCY",
  payload: state
});

export const resolve_discrepancy_reset = state => ({
  type: "RESOLVE_DISCREPANCY_RESET",
  payload: state
});