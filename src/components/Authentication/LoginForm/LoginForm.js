import React from "react";
import { Link } from "react-router-dom";
import CONSTANTS from "../../../config/constants.json";
import validators from "../../../validators";
import { login } from "../../../reduxUtils/actions/auth";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import "./LoginForm.scss";
import ForgotPassword from "../ForgotPassword/ForgotPassword";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null,
      forgotPasswordToggle: false,
    };
    this.validator = new SimpleReactValidator({
      validators: {
        usernameValidation: {
          message: CONSTANTS.LOGIN.USERNAME_INFO,
          required: true
        },
        strongPwdChecker: {
          message: CONSTANTS.LOGIN.PASSWORD_INFO,
          required: true
        }
      }
    });
  }
  onchange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  submitHandler = () => {
    if (this.validator.allValid()) {
      this.props.login(this.state);
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  onForgotToggle = () => {
    this.setState(prevState => ({
      forgotPasswordToggle: !prevState.forgotPasswordToggle
    }));
  }

  render() {
    return (
      <div>
        {
          this.state.forgotPasswordToggle ?
            <ForgotPassword
              forgotPasswordToggle={this.state.forgotPasswordToggle}
              onToggle={this.onForgotToggle}
            />
            : ""
        }
        <form>
          <div className="login-fancy pb-40 clearfix">
            {/* {
              <div className="text-center">
                <Link className="navbar-brand brand-logo" to="/">
                  <img src="assets/images/logo-dark.png" alt="" />
                </Link>
              </div>
            } */}
            {/* <h6 className="mb-20">{CONSTANTS.AUTH.LOGIN.HEADER}</h6> */}

            <div className="form-group row">
              <label
                htmlFor="inputUsername"
                className="col-form-label col-md-4"
              >
                {CONSTANTS.GENERIC.USERNAME}{" "}
                <span className="text-danger">*</span>
              </label>
              <div className="col-md-8">
                <input
                  id="email"
                  className="web form-control"
                  type="text"
                  placeholder="Email / Username"
                  value={this.state.email}
                  name="email"
                  onChange={this.onchange}
                />
                <div className="error">
                  {this.validator.message(
                    "Email/ Username",
                    this.state.email,
                    "required"
                  )}
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="inputPassword"
                className="col-form-label col-md-4"
              >
                {CONSTANTS.GENERIC.PASSWORD}{" "}
                <span className="text-danger">*</span>
              </label>
              <div className="col-md-8">
                <input
                  id="password"
                  className="Password form-control"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  name="password"
                  onChange={this.onchange}
                />
                <div className="error">
                  {this.validator.message(
                    "Password",
                    this.state.password,
                    "required"
                  )}
                </div>
              </div>
            </div>

            <div className="form-group row">
              <div className="col-md-8">
                <p className="mt-0 mb-0 blue">
                  {/* {CONSTANTS.AUTH.LOGIN.NO_ACCOUNT} */}
                  <br />
                  <Link to="/register" className="linkButton mr-1">
                    {/* {CONSTANTS.AUTH.LOGIN.REGISTER} */}
                  </Link>
                  {/* | */}
                  {/* <Link to="/forgot-password" className="linkButton ml-1">
                    {CONSTANTS.AUTH.LOGIN.FORGOT_PASSWORD}
                  </Link> */}
                  {
                    <span onClick={() => this.onForgotToggle()} style={{ cursor: "pointer" }}>
                      {CONSTANTS.AUTH.LOGIN.FORGOT_PASSWORD}
                    </span>
                  }
                </p>
              </div>
              <div className="col-md-2 cursor-pointer">
                <a
                  onClick={() => this.submitHandler()}
                  className="button"
                  id="submitBtn"
                >
                  <span className="text-white" style={{ cursor: "pointer" }}>
                    {CONSTANTS.AUTH.LOGIN.LOGIN}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  login: login
};

const mapStateToProps = state => {
  return {
    stateOfuser: state.user
  };
};

LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);

export default LoginForm;
