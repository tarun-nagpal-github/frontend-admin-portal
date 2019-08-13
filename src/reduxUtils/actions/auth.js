export const login = state => ({
  type: "LOGIN",
  payload: state
});

export const logout = state => ({
  type: "LOGOUT",
  payload: state
});

export const reset_login = state => ({
  type: "RESET_LOGIN",
  payload: state
});

export const token_expire = state => ({
  type: "TOKEN_EXPIRE",
  payload: state
});

export const token_expire_reset = state => ({
  type: "TOKEN_EXPIRE_RESET",
  payload: state
});
