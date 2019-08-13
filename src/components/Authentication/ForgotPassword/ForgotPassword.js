import React from "react";
import { Link } from "react-router-dom";
import CONSTANTS from "../../../config/constants.json";
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { Row, Col, Container } from "reactstrap";
import { forgot_password, reset_action } from "../../../reduxUtils/actions/password";
import { errorList } from "../../../utils/HelperFunctions";
import { apolloClientGraphQL } from "../../../utils/HelperFunctions";
import { ApolloProvider } from 'react-apollo';
import endpoint from '../../../config/endpoints';

class ForgotPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: null,
            forgotPasswordToggle: props.forgotPasswordToggle
        };

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
                }
            }
        });
    }

    componentWillMount() {
        this.props.reset_action();
        this.client = apolloClientGraphQL(endpoint.GRAPHQL_URL);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            forgotPasswordToggle: nextProps.forgotPasswordToggle,
        });
    }

    sendEmailResetPassword = () => {
        if (this.validator.allValid()) {
            this.props.forgot_password(this.state.username)
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    onTogglePopup = () => {
        this.setState({ forgotPasswordToggle: false });
        this.props.onToggle();
    }

    onchange = () => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    componentWillUnmount() {
        this.props.reset_action();
    }

    successLog = () => {
        if (this.props.stateOfPassword.status == 200) {
            setTimeout(() => {
                // this.setState({ forgotPasswordToggle: false });
                this.props.onToggle();
            }, 3000);

            return (
                <Alert color="success">
                    {CONSTANTS.GENERIC.FORGET_PASSWORD.SUCCESS}
                </Alert>
            );
        }
    }

    render() {
        return (
            <Modal isOpen={this.state.forgotPasswordToggle} toggle={this.onTogglePopup} >
                <ModalHeader toggle={this.onTogglePopup}>{CONSTANTS.GENERIC.FORGET_PASSWORD.HEADER}</ModalHeader>
                <ModalBody className="forgot-password-div">
                    {
                        this.props.stateOfPassword.status == 400 ? errorList(this.props.stateOfPassword.errors) : ""
                    }
                    {this.successLog()}
                    <Row>
                        <div className="col-md-12">
                            <div className="form-group">
                                <label for="exampleInputEmail1">{CONSTANTS.GENERIC.FORGET_PASSWORD.USERNAME}{"/ "}{CONSTANTS.GENERIC.FORGET_PASSWORD.EMAIL}</label>
                                <input type="input" className="form-control" id="username" name="username" placeholder={CONSTANTS.GENERIC.FORGET_PASSWORD.HELPTEXT} value={this.state.username} onChange={this.onchange} />
                                <div className="error">
                                    {this.validator.message(
                                        "Email/ Username",
                                        this.state.username,
                                        "required:Email/ Username"
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="button" className="btn btn-primary w-100" onClick={() => this.sendEmailResetPassword()}>
                                    {CONSTANTS.GENERIC.FORGET_PASSWORD.BTN_SUBMIT}
                                </button>
                            </div>
                        </div>
                    </Row>
                </ModalBody>
            </Modal>
        );
    }
}

const mapDispatchToProps = {
    reset_action,
    forgot_password
};

const mapStateToProps = state => {
    return {
        stateOfPassword: state.password_reducer
    };
};

ForgotPassword = connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPassword);

export default ForgotPassword;
