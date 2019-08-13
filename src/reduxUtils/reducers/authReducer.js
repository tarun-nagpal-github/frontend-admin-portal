import leftMenuData from "../../config/LeftMenu.json";
import permittedPages from "../../config/PermitedPages.json";

const INITIAL_STATE = {
  userName: "Default Username",
  loginSuccess: null,
  loginFailed: null,
  logoutSuccess: null,
  authToken: null,
  leftNav: leftMenuData,
  permittedPages: permittedPages,
  showLoader: false,
  serverFailed: null,
  tokenExpired: null,
  isError: false
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        userName: action.payload,
        showLoader: true,
        serverFailed: null,
        isError: false
      };
    case "LOGOUT":
      return {
        ...state,
        logoutSuccess: true,
        loginSuccess: false,
        authToken: null
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        logoutSuccess: true,
        loginSuccess: false,
        userName: "",
        loginFailed: null,
        authToken: null,
        showLoader: false,
        serverFailed: null,
        isError: false
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loginSuccess: action.loginSuccess,
        authToken: action.authToken,
        showLoader: false,
        leftNav: leftMenuData,
        permittedPages: permittedPages
      };
    case "LOGIN_FAILED":
      return {
        ...state,
        loginFailed: action.loginFailed,
        showLoader: false,
        isError: true,
        tokenExpired: false
      };
    case "SERVER_FAILED":
      return {
        ...state,
        serverFailed: action.serverFailed,
        showLoader: false,
        isError: true
      };
    case "TOKEN_EXPIRE":
      return {
        ...state,
        tokenExpired: true,
        showLoader: false,
        authToken: null,
        isError: true,
        loginSuccess: null,
      };
    case "TOKEN_EXPIRE_RESET":
      return {
        ...state,
        tokenExpired: false,
        showLoader: false,
        loginSuccess: false,
        isError: false
      };
    case "RESET_LOGIN":
      return {
        ...state,
        userName: "Default Username",
        loginSuccess: null,
        loginFailed: null,
        logoutSuccess: null,
        authToken: null,
        showLoader: false,
        serverFailed: null,
        tokenExpired: null,
        isError: false
      }
    default:
      return state;
  }
};

export default authReducer;