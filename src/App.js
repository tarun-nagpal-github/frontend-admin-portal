import React, { Component } from "react";
import { HashRouter } from "react-router-dom";
import Routers from "./Routers.js";
import { connect } from "react-redux";

import "../node_modules/jquery/dist/jquery.min.js";
import "./Vendor.js";
import Axios from "axios";
import { logout, token_expire } from "../src/reduxUtils/actions/auth";
import { Redirect } from "react-router";
import PrintDocument from "./utils/PrintDocument";



class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Axios.interceptors.response.use(undefined, error => {
    //   const error = err.response;
    //   // if error is 401
    //   if (error.status === 401 && error.config &&
    //     !error.config.__isRetryRequest) {

    //     return <Redirect to="/login" />;
    //     // if (this.props.stateOfuser.authToken) {
    //     //   console.log("401 - With AUTH Token");
    //     //   this.props.logout(this.props.stateOfuser.authToken);
    //     // } else {
    //     //   console.log("401 - Without AUTH Token");
    //     //   return <Redirect to="/login" />;
    //     // }
    //   }
    // });

    /**
     * Response interceptor
     * Catch basic errors like 401 and redirect to login
     * This configuration applies for all responses
     */
    Axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {

        // Do something with response error
        if (typeof error === 'undefined') {
          // request cancelled
          // when backend server is not available at all

        } else if (typeof error.response === 'undefined') {
          // when request is timeout

        } else if (error.response.status === 401) {
          // apply refresh token logic here instead of redirecting to login
          // this.props.token_expire();
        }
        return Promise.reject(error);
      }
    );
    return (
      <div>
        <PrintDocument />
        <HashRouter>
          <Routers />
        </HashRouter>
      </div>
    );
  }
}


const mapStateToProps = state => {
  return {
    stateOfuser: state.user
  };
};

const mapDispatchToProps = {
  logout: logout
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
