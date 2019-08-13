import React from "react";
import CONSTANTS from "../../../config/constants.json";
import { connect } from "react-redux";
import { Card, CardBody } from "reactstrap";
import SimpleReactValidator from "simple-react-validator";
import { reset_action, change_password } from "../../../reduxUtils/actions/password";
import { errorList, regularExpCodeForPassword } from "../../../utils/HelperFunctions";
import { ToastContainer, toast } from "react-toastify";

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            authToken: this.props.stateOfUser.authToken,
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
                    message: CONSTANTS.GENERIC.CHANGE_PASSWORD.CONFIRM_PASSWORD,
                    rule: (val, params, validator) => {
                        if (val != params) {
                            return false;
                        }
                    },
                    required: true
                },
                strongPwdChecker: {
                    message: CONSTANTS.GENERIC.CHANGE_PASSWORD.PWD_INFO,
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

    componentWillMount(){
        this.baseState = this.state;
        this.props.reset_action();
    }

    componentWillUnmount(){
        this.props.reset_action();
    }

    onChangeEvent = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    submitHandler = () => {
        if (this.validator.allValid()) {
            this.props.change_password(this.state)
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    responsePasswordChanged = () => {
        if(this.props.stateOfPassword.status == 200){
            this.setState(this.baseState);
            toast.success(CONSTANTS.GENERIC.CHANGE_PASSWORD.SUCCESS_MSG, {});
            this.props.reset_action();
        }
    }

    listMessages = () => {
        if (this.props.stateOfPassword.status == 400) {
            return errorList(this.props.stateOfPassword.errors);
        }
    }

    render() {
        this.responsePasswordChanged();
        return (
            <div>
                <ToastContainer />
                <div className="page-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h6 className="mb-0">{CONSTANTS.GENERIC.CHANGE_PASSWORD.PAGE}</h6>
                        </div>
                        <div className="col-sm-6">
                            <nav
                                className="float-left float-sm-right"
                                aria-label="breadcrumb"
                            >
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="#">Home</a>
                                    </li>
                                    <li className="active breadcrumb-item" aria-current="page">
                                        Change Password
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
                <Card className="card-statistics">
                    <CardBody>
                        {this.listMessages()}
                        <form autoComplete="false">
                            <div className="form-group">
                                <label className="control-label col-md-2" for="email">Current Password </label>
                                <div className="col-md-6">
                                    <input type="password" autoComplete="currentPassword" className="form-control" id="currentPassword" name="currentPassword" onChange={this.onChangeEvent} value={this.state.currentPassword} />
                                    <div className="error">
                                        {this.validator.message(
                                            "Current Password",
                                            this.state.currentPassword,
                                            "required:Current Password"
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-md-2">New Password</label>
                                <div className="col-md-6">
                                    <input type="password" id="newPassword" name="newPassword" onChange={this.onChangeEvent} className="form-control" id="email" value={this.state.newPassword} />
                                    <div className="error">
                                        {this.validator.message(
                                            "New Password",
                                            this.state.newPassword,
                                            "required:New Password|strongPwdChecker"
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label col-sm-2">Confirm Password</label>
                                <div className="col-sm-6">
                                    <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" onChange={this.onChangeEvent} value={this.state.confirmPassword} />
                                    <div className="error">
                                        {this.validator.message(
                                            "Confirm Password",
                                            this.state.confirmPassword,
                                            "required:Confirm Password|confPasswordMatch:" +
                                            this.state.newPassword
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="btn btn-primary ml-3" onClick={() => this.submitHandler()}>
                                Update Password
                            </button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

const mapDispatchToProps = {
    reset_action,
    change_password
};

const mapStateToProps = state => {
    return {
        stateOfPassword: state.password_reducer,
        stateOfUser: state.user
    };
};

ChangePassword = connect(
    mapStateToProps,
    mapDispatchToProps
)(ChangePassword);

export default ChangePassword;