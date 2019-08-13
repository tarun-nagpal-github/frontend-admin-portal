import React from "react";
import { Alert } from "reactstrap";
import CONSTANTS from "../../../config/constants.json";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { reset_password, reset_action } from "../../../reduxUtils/actions/password";
import { errorList, regularExpCodeForPassword } from "../../../utils/HelperFunctions";
import queryString from 'query-string';
import { Redirect } from "react-router";

class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            confirmNewPassword: "",
            token: null,
            successState: false,
            serverErrorState: false,
            redirectTo: false,
            errorFromServerState: false,
            visible: false
        }

        this.validator = new SimpleReactValidator({
            validators: {
                required: {
                    message: ":field is required",
                    rule: (val, params, validator) => {
                        return val != "";
                    },
                    messageReplace: (message, params) =>
                        message.replace(
                            ":field",
                            this.validator.helpers.toSentence(params)
                        ),
                    required: true
                },
                confPasswordMatch: {
                    message: CONSTANTS.GENERIC.RESET_PASSWORD.CONFIRM_PASSWORD,
                    rule: (val, params, validator) => {
                        if (val != params) {
                            return false;
                        }
                    },
                    required: true
                },
                strongPwdChecker: {
                    message: CONSTANTS.GENERIC.RESET_PASSWORD.PWD_INFO,
                    rule: (val, params, validator) => {
                        return validator.helpers.testRegex(
                            val,
                            regularExpCodeForPassword()
                        );
                    },
                    required: true
                }
            }
        });
    }

    componentWillMount() {
        this.props.reset_action();
        const param = queryString.parse(this.props.location.search);
        if (param && "uid" in param) {
            this.setState({
                token: param.uid
            });
        }
    }

    componentWillUnmount() {
        this.props.reset_action();
    }

    resetPasswordSubmit = () => {
        if (this.validator.allValid()) {
            const params = {
                newPassword: this.state.newPassword,
                confirmNewPassword: this.state.confirmNewPassword,
                token: this.state.token
            };
            this.setState({
                successState: false,
                serverErrorState: false
            }, () => this.props.reset_password(params));
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    onchange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    listMessages = () => {
        if (this.state.successState) {
            return (
                <div>
                    <div className="text-success">
                        {CONSTANTS.GENERIC.RESET_PASSWORD.PASSWORD_SUCCESS}
                    </div>
                </div>
            );
        }

        if (this.state.serverErrorState) {
            return (
                <div>
                    <Alert color="danger">
                        {CONSTANTS.GENERIC.RESET_PASSWORD.SERVER_ERROR}
                    </Alert>
                </div>
            );
        }

        if (this.props.stateOfPassword.status == 400) {
            return errorList(this.props.stateOfPassword.errors);
        }
    }

    resetPasswordResponse = () => {
        if (this.props.stateOfPassword.status == 200) {
            setTimeout(() => {
                this.setState({
                    redirectTo: true
                })
            }, 3000);
            this.setState({
                successState: true
            }, () => this.props.reset_action())
        }

        if (this.props.stateOfPassword.status >= 500) {
            this.setState({
                serverErrorState: true
            }, () => this.props.reset_action())
        }
    }

    redirectTo = () => {
        if (this.state.redirectTo) {
            return <Redirect to="/login" />;
        }
    };

    visibility = () => {
        this.setState(prevState => ({
            visible: !prevState.visible
        }));
    }

    render() {
        this.resetPasswordResponse();
        return (
            <div className="login">
                {this.redirectTo()}
                <div className="top-content">
                    <div className="inner-bg">
                        <div className="container">
                            <div className="d-flex justify-content-center mb-3">
                                <div className="col-md-5">
                                    <div className="form-group text-center">
                                        <img src="/assets/images/logo-dark.png" className="mb-4" />
                                        <h4>{CONSTANTS.GENERIC.RESET_PASSWORD.HEADER}</h4>
                                        <small>
                                            {CONSTANTS.GENERIC.RESET_PASSWORD.INFO}
                                        </small>
                                        <div className="text-left">
                                            {this.listMessages()}
                                        </div>
                                        <div className="input-group mt-2">
                                            <input type={this.state.visible ? "text" : "password"} className="form-control" placeholder="Enter new password" id="newPassword" name="newPassword" value={this.state.newPassword} onChange={this.onchange} />
                                            <div className="input-group-append">
                                                <i className={this.state.visible ? "fa fa-eye input-group-text" : "fa fa-eye-slash input-group-text"} onClick={() => this.visibility()}></i>
                                            </div>
                                        </div>
                                        <div className="error">
                                            {this.validator.message(
                                                "New Password",
                                                this.state.newPassword,
                                                "required:New Password|strongPwdChecker"
                                            )}
                                        </div>
                                        <input type={this.state.visible ? "text" : "password"} className="form-control mt-2" id="confirmNewPassword" name="confirmNewPassword" placeholder="Confirm new password" value={this.state.confirmNewPassword} onChange={this.onchange} />
                                        <div className="error">
                                            {this.validator.message(
                                                "New Password",
                                                this.state.confirmNewPassword,
                                                "required:Confirm Password|confPasswordMatch:" +
                                                this.state.newPassword
                                            )}
                                        </div>
                                        <div className="mt-3">
                                            <button type="button" className="btn btn-primary w-100" onClick={() => this.resetPasswordSubmit()}>
                                                <i className="fa fa-key" aria-hidden="true"></i> {CONSTANTS.GENERIC.RESET_PASSWORD.BTN}
                                            </button>
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
    reset_action,
    reset_password
};

const mapStateToProps = state => {
    return {
        stateOfPassword: state.password_reducer
    };
};

ResetPassword = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResetPassword);

export default ResetPassword;