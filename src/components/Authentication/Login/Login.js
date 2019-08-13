import React from "react";
import "./Login.scss";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import LoginForm from "../LoginForm/LoginForm";
import CONSTANTS from "../../../config/constants.json";

// Loader files
import { Loader } from "react-overlay-loader";
import "../../../assets/scss/_loader.scss";
import { reset_login } from "../../../reduxUtils/actions/auth";
import { Card, CardBody, Alert } from "reactstrap";
import { get_permitted_pages, get_permitted_pages_reset } from "../../../reduxUtils/actions/permissions/permissions";


import Axios from "axios";
import endpoint from '../../../config/endpoints';
import { AxiosErrorHandler } from "../../../utils/AxiosErrorHandler";
const API_AUTH_ENDPOINT = endpoint.USER_URL;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.calledOnce = false;
    this.state = {
      showerror: false,
      errorMessage: null,
      // authToken: this.props.stateOfUser.authToken,
      getPermittedPagesQuery: null,
      redirectOnce: true
    }
  }

  getMetaInfo() {
    let config = {
      headers: {
        "Content-Type": "application/json-patch+json",
        "Authorization": "Bearer " + this.props.stateOfuser.authToken
      }
    }
    Axios.get(API_AUTH_ENDPOINT + "user/info", config).then((response) => {
      let userId = 0;
      if (Array.isArray(response.data.data) && response.data.data.length > 0) {
        userId = response.data.data[0].userId;
      }
      let query = `
      {
        user(id:${userId}){
          firstName
          lastName  
          email
          userModulePages {
            modulePage 
            modulePageUrl
            moduleId
            moduleName
            modulePageId
            actions {
              actionId
              actionUrl
              action
              roleIsActive
            }
          }
        }
      }
      `;
      this.setState(
        {
          idUser: (userId),
          getPermittedPagesQuery: query
        }, () => {       
          this.props.get_permitted_pages(this.state);
        });
    }).catch(AxiosErrorHandler);
  }

  


  componentDidMount() {
    // this.props.resetLogin(true);
  }
  redirectView = () => {
    if (this.props.stateOfuser.loginSuccess) {
      this.getMetaInfo();
    }
  };

  onShowAlert = (message = null) => {
    this.props.resetLogin(true);
    this.setState({ showerror: true }, () => {
      window.setTimeout(() => {
        this.setState({ showerror: false })
      }, 5000)
    });
  }

  onDismiss = () => {
    this.setState({ errorMessage: null });
  }

  loginAfter = () => {    
    if (this.props.stateOfuser.loginSuccess) {
      if(!this.calledOnce){
        this.calledOnce = true;
        this.getMetaInfo();
      }      
      if (this.props.permittedPages.status == 200) {               
        this.setState({redirectOnce : false});
        return <Redirect to="/dashboard" />;
      }
    }

  }

  render() {
    let stateOfuser = this.props.stateOfuser;
    if (stateOfuser.loginFailed) {
      this.state.errorMessage = CONSTANTS.MESSAGES.LOGIN_FAILURE;
      this.onShowAlert();
    } else if (stateOfuser.serverFailed) {
      this.state.errorMessage = CONSTANTS.MESSAGES.SERVER_FAILURE;
      this.onShowAlert();
    } else if (stateOfuser.tokenExpired) {
      this.state.errorMessage = CONSTANTS.MESSAGES.TOKEN_EXPIRE
      this.onShowAlert();
    }

    return (
      <div className="login">
        {/* {this.redirectView()} */}
        <Loader fullPage loading={stateOfuser.showLoader} />
        {this.loginAfter()}
        <div className="top-content">
          <div className="inner-bg">
            <div className="container">
              <div className="row">
                <div className="col-md-login">
                  <Alert color="danger" toggle={this.onDismiss} isOpen={this.state.errorMessage != null}>{this.state.errorMessage}</Alert>
                </div>
              </div>
              <div className="row">
                <div className="col-md-7 img-login-banner">
                  <div className="form-box">
                    <div className="centered-header">
                      Welcome to Extron
                    </div>
                    <div className="body-text">
                      Global Logistics Network
                    </div>
                    <div className="img-banner-login">
                      <img src="assets/images/logo-dark.png" alt="" className="login-img" />
                    </div>

                    {/* <Link className="navbar-brand brand-logo" to="/">
                        <img src="assets/images/login-image.jpg" alt="" />
                      </Link> */}

                  </div>
                  {/* <div className="form-box">
                    <div className="form-top">
                      <div className="form-top-left">
                        <h1>Welcome to Extron</h1>
                        <p>Enter username and password to log on:</p>
                      </div>
                    </div>
                    <div className="form-bottom min-height">
                    </div>
                  </div> */}
                </div>

                <div className="col-md-5 border-left">
                  <div className="">
                    <div className="form-top">
                      <div className="form-top-left">
                        <h3>Login </h3>
                        <p>Login to Extron Global Logistics Network:</p>
                      </div>
                      {/* <div className="form-top-right">
                        <i className="fa fa-key" />
                      </div> */}
                    </div>
                    <div className="form-bottom">
                      <LoginForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  resetLogin: reset_login,
  get_permitted_pages_reset, get_permitted_pages
};

const mapStateToProps = state => {
  return {
    stateOfuser: state.user,
    permittedPages: state.getPermittedPagesReducer
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
