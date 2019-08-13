export const create_user = state => ({
  type: "CREATE_USER",
  payload: state
});

export const update_user = state => ({
  type: "UPDATE_USER",
  payload: state
});

export const update_user_reset = state => ({
  type: "UPDATE_USER_RESET",
  payload: state
});

export const reset_action = () => ({
  type: "USER_RESET_ACTION"
});

export const get_user_meta_info = state => ({
  type: "GET_USER_META_INFO",
  payload: state
});

export const reset_meta_info = state => ({
  type: "RESET_GET_USER_META_INFO",
  payload: state
});

export const delete_users = state => ({
  type: "DELETE_USERS",
  payload: state
});

export const delete_users_reset = state => ({
  type: "DELETE_USERS_RESET",
  payload: state
});

export const get_users = state => ({
  type: "GET_USERS",
  payload: state
});
export const reset_user_list = state => ({
  type: "GET_USERS_RESET"
});

export const edit_user = state => ({
  type: "GET_USER",
  payload: state
});
export const reset_edit_user = state => ({
  type: "GET_USER_RESET",
  payload: state
});