import React from "react";
import { Card, CardBody, Alert } from "reactstrap";
import SimpleReactValidator from "simple-react-validator";
import CONSTANTS_IMPORT from "../../config/constants.json";
import { create_user, reset_action, reset_edit_user, update_user, update_user_reset } from "../../reduxUtils/actions/users";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from "react-router";
import {
  usernameUniqueCheck,
  emailUniqueCheck
} from "../../services/GenericService";
import { ApolloProvider } from "react-apollo";
import FulfillmentZone from "../Elements/FulfillmentZone";
import Roles from "../Elements/Roles";
import { apolloClientGraphQL } from "../../utils/HelperFunctions";
import endpoint from "../../config/endpoints";
import ReactTooltip from "react-tooltip";
import ReactCodeInput from "react-code-input";
import { currentRoute } from "../../reduxUtils/actions/currentRoute";
import { fetch_helptext, reset_helpertext } from "../../reduxUtils/actions/generic";
import UserList from "./UserList";
import "./CreateUser.scss";
import { Loader } from "react-overlay-loader";

const CONSTANTS_CREATE_USER = CONSTANTS_IMPORT.CREATE_USER;

class CreateUser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confPassword: "",
      fulfillmentZone: "default",
      assignedRole: "default",
      pin: "",
      changePassword: true,
      authToken: this.props.stateOfAction.authToken,
      redirectState: false,
      usernameIsValid: true,
      isUniqueUser: true,
      usernameIsValidViaUser: true,
      usernameIsValidViaEmail: true,
      usernameRequired: false,
      info: [],
      // isTooltipEnable: this.props.stateOfActiion.showToolTip
      isTooltipEnable: true,
      emailValidation: true,
      isUniqueEmail: true,
      emailRequired: false,
      tooltip: "tt_create_user",
      errors: [],
      isEditMode: false
    };

    this.usernameCheckerResponse = [];
    this.initValidator();
    this.pinRef = "";
  }


  initValidator = () => {
    return this.validator = new SimpleReactValidator({
      validators: {
        confPasswordMatch: {
          message: CONSTANTS_CREATE_USER.PASSWORDCONF_INFO,
          rule: (val, params, validator) => {
            if (val != params) {
              return false;
            }
          },
          required: true
        },
        checkSelect: {
          message: CONSTANTS_CREATE_USER.DDL_INFO,
          rule: (val, params) => {
            if (val == "default") {
              return false;
            }
          },
          required: true
        },
        checkLength: {
          message: CONSTANTS_CREATE_USER.CHKLENGTH_INFO,
          rule: (val, params, validator) => {
            if (val.toString().length == params) {
              return true;
            }
            return false;
          },
          messageReplace: (message, params) =>
            message.replace(
              ":value",
              this.validator.helpers.toSentence(params)
            ),
          required: true
        },
        strongPwdChecker: {
          message: CONSTANTS_CREATE_USER.PWD_INFO,
          rule: (val, params, validator) => {
            return validator.helpers.testRegex(
              val,
              /(?=^.{6,20}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/i
            );
          },
          required: true
        },
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

  emailIsUnique = async e => {
    this.setState({
      isUniqueUser: true,
      isUniqueEmail: true,
      emailRequired: false
    });
    let email = e.target.value;
    let request = {
      token: this.state.authToken,
      email: email
    };

    var emailCheck = new RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    var isValid = emailCheck.test(email);

    if (isValid) {
      this.setState({
        emailValidation: true
      });
      this.emailResponse = await emailUniqueCheck(request);
      if (this.emailResponse.data.status == 200) {
        this.setState({ isUniqueEmail: true });
      }

      if (this.emailResponse.data.status == 400) {
        this.setState({ isUniqueEmail: false });
      }
    } else {
      this.setState({
        emailValidation: false
      });
    }
  };

  usernameIsUnique = async e => {
    this.setState({
      usernameIsValidViaEmail: true,
      usernameIsValidViaUser: true,
      isUniqueUser: true,
      usernameRequired: false
    });
    var value = e.target.value;
    let request = {
      token: this.state.authToken,
      userName: value
    };

    // check user value/email
    var emailChecker = new RegExp(
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    );
    var userChecker = new RegExp(
      /(?=^.{5,15}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[.-_])(?!.*\s).*/
    );

    if (value.includes("@")) {
      var emailErrorStatus = emailChecker.test(value);
    } else {
      var userErrorStatus = userChecker.test(value);
    }
    // var resultUserChecker = userChecker.test(value);
    this.setState({
      usernameIsValidViaEmail: emailErrorStatus,
      usernameIsValidViaUser: userErrorStatus
    });
    if (emailErrorStatus || userErrorStatus) {
      this.usernameCheckerResponse = await usernameUniqueCheck(request);
      if (this.usernameCheckerResponse.data.status == 200) {
        this.setState({ isUniqueUser: true });
      }

      if (this.usernameCheckerResponse.data.status == 400) {
        this.setState({ isUniqueUser: false });
      }
    }
  };

  componentWillUnmount() {
    // this.props.reset_action();
  }

  componentWillMount() {
    this.baseState = this.state;
    if (this.state.isTooltipEnable) {
      this.props.fetch_helpertext(this.state.tooltip);
    }
    this.props.currentRoute(location.hash); // TODO: refine this service
    this.client = apolloClientGraphQL(endpoint.GRAPHQL_URL);
  }

  handleAction = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  pinChange = value => {
    this.setState({ pin: value });
  };

  submitHandler = () => {
    if (
      this.validator.allValid() &&
      this.state.isUniqueUser &&
      this.state.userName != "" &&
      this.state.email != "" &&
      this.state.isUniqueEmail
    ) {
      // this.setState({
      //     usernameRequired: false
      // });
      if (this.state.isEditMode) {
        this.props.update_user(this.state);
      } else {
        this.props.create_user(this.state);
      }
    } else {
      if (this.state.userName == "" && !this.state.isEditMode) {
        this.setState({
          usernameRequired: true,
          emailRequired: true
        });
      }
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  changePassword = event => {
    this.setState({
      changePassword: !this.state.changePassword
    });
  };

  selectZone = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  selectRole = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  toastrRaised = () => {
    toast.configure({
      autoClose: 2000,
      draggable: false
    });
    switch (this.props.stateOfUser.status) {
      case 200:
        this.props.reset_action();
        this.formReset();
        toast.success("User has been created!");
        break;
    }

    switch (this.props.stateOfUpdateUser.status) {
      case 200:
        this.props.update_user_reset();
        this.formReset();
        toast.success("User has been updated!", {
          onClose: () => {
            // return this.setState({ redirectState: true });
          }
        });
        break
    }
  };
  redirectTo = () => {
    if (this.state.redirectState) {
      return <Redirect to="/users-list" />;
    }
  };

  formReset = () => {
    // this.pinRef.state.input=[];
    this.initValidator();
    this.setState(this.baseState);
  }

  responseHelptext = () => {
    if (this.props.stateOfGenerics.status == 200) {
      var tooltipData = [];
      this.props.stateOfGenerics.data.forEach((val, index) => {
        tooltipData[val.constantValue] = val.constantExpression;
      });
      this.setState({
        info: tooltipData
      }, () => this.props.reset_helpertext());
    }
  }
  displayErrosOnPage = (errors = []) => {
    return errors.map((error, idx) => (
      <Alert key={idx} color="danger">
        {error}
      </Alert>
    ));
  }

  editUserResponse = () => {
    if (this.props.stateOfEditUser.status == 200) {
      this.initValidator();
      let userData = this.props.stateOfEditUser.data;
      this.setState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
        pin: "",
        fulfillmentZone: userData.idFulfillmentZone,
        assignedRole: userData.idUserRoles,
        isEditMode: true,
        actionItem: "update",
        pin: null,
        fulfillmentZone: userData.idFulfillmentZone,
        assignedRole: userData.idUserRoles,
        isEditMode: true,
        actionItem: "update",
        idUser: userData.idUser,
        userId: userData.userId
      }, () => {
        this.props.reset_edit_user();
      });
    } else if (this.props.stateOfEditUser.status == 400) {
      // this.props.reset_user_list();
      this.setState({
        status: this.props.stateOfEditUser.status,
        errors: this.props.stateOfEditUser.errors
      }, () => {
        this.props.reset_edit_user();
      });
    }
  }

  // responseUpdateUser = () => {
  //   if (this.props.stateOfUser.status == 200) {

  //   }
  // }


  render() {
    this.responseHelptext();
    return (
      <div>
        <Loader loading={this.props.stateOfEditUser.loader} />
        {this.editUserResponse()}
        {this.displayErrosOnPage(this.state.errors)}
        <ToastContainer />
        {this.toastrRaised()}
        {this.redirectTo()}
        <div className="page-title">
          <div className="row">
            <div className="col-sm-3">
              <h4 className="mb-0">{CONSTANTS_CREATE_USER.PAGE}</h4>
            </div>
          </div>
          <div className="row user-list">
            <div className="col-sm-3">
              <h6 className="mb-0">{(this.state.isEditMode) ? "Update User" : "Create New User"}</h6>
            </div>
          </div>
        </div>
        <form autoComplete="false">
          <Card className="card-statistics mb-3">
            <CardBody>
              <div className="form-row">
                <div className="col-md-4">
                  <div className="row">
                    <div className="form-group col-md-4">
                      <label>
                        {CONSTANTS_CREATE_USER.FIRST_NAME}
                        <span className="text-danger">*</span>
                        <i
                          className={
                            "fa fa-info-circle float-right mt-1 ml-1 " +
                            (this.state.isTooltipEnable ? "d-block" : "d-none")
                          }
                          aria-hidden="true"
                          data-tip
                          data-for="tt_first_name"
                        />
                        <ReactTooltip
                          id="tt_first_name"
                          type="dark"
                          effect="solid"
                        >
                          <p className="tooltip-ts">
                            {this.state.info.tt_first_name}
                          </p>
                        </ReactTooltip>
                      </label>
                    </div>
                    <div className="form-group col-md-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="First name"
                        name="firstName"
                        id="firstName"
                        value={this.state.firstName}
                        onChange={this.handleAction}
                        maxLength="40"
                      />
                      <div className="error">
                        {this.validator.message(
                          "First Name",
                          this.state.firstName,
                          "required:First Name|alpha|max:40"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-md-1" />
                    <div className="form-group col-md-4">
                      <label>
                        {CONSTANTS_CREATE_USER.LAST_NAME}
                        <span className="text-danger">*</span>
                        <i
                          className={
                            "fa fa-info-circle float-right mt-1 ml-1 " +
                            (this.state.isTooltipEnable ? "d-block" : "d-none")
                          }
                          aria-hidden="true"
                          data-tip
                          data-for="tt_last_name"
                        />
                        <ReactTooltip
                          id="tt_last_name"
                          type="dark"
                          effect="solid"
                        >
                          <p className="tooltip-ts">
                            {this.state.info.tt_last_name}
                          </p>
                        </ReactTooltip>
                      </label>
                    </div>
                    <div className="form-group col-md-7">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Last name"
                        name="lastName"
                        id="lastName"
                        value={this.state.lastName}
                        onChange={this.handleAction}
                        maxLength="40"
                      />
                      <div className="error">
                        {this.validator.message(
                          "Last Name",
                          this.state.lastName,
                          "required:Last Name|alpha|max:40"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-md-1" />
                    <div className="form-group col-md-4">
                      <label>
                        {CONSTANTS_CREATE_USER.USERNAME}
                        <span className="text-danger">*</span>
                        <i
                          className={
                            "fa fa-info-circle float-right mt-1 ml-1 " +
                            (this.state.isTooltipEnable ? "d-block" : "d-none")
                          }
                          aria-hidden="true"
                          data-tip
                          data-for="tt_username"
                        />
                        <ReactTooltip
                          id="tt_username"
                          type="dark"
                          effect="solid"
                        >
                          <p className="tooltip-ts">
                            {this.state.info.tt_username}
                          </p>
                        </ReactTooltip>
                      </label>
                    </div>
                    <div className="form-group col-md-7">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        name="userName"
                        id="userName"
                        value={this.state.userName}
                        onChange={this.handleAction}
                        onBlur={this.usernameIsUnique}
                        maxLength="15"
                        disabled={this.state.isEditMode}
                        autoComplete="false"

                      />
                      {this.state.usernameIsValidViaUser == false
                        ? this.usernameError()
                        : ""}

                      {this.state.usernameIsValidViaEmail == false
                        ? this.emailError()
                        : ""}

                      {this.state.isUniqueUser == false
                        ? this.isUniqueUserError()
                        : ""}
                      {this.state.usernameRequired == true
                        ? this.usernameRequiredError()
                        : ""}

                      {/* {this.validator.message(
                          "Username",
                          this.state.userName,
                          "required|usernameValidation|min:6|max:15"
                        )} */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="col-md-4">
                  <div className="row">
                    <div className="form-group col-md-4">
                      <label>
                        {CONSTANTS_CREATE_USER.EMAIL}
                        <span className="text-danger">*</span>
                        <i
                          className={
                            "fa fa-info-circle float-right mt-1 ml-1 " +
                            (this.state.isTooltipEnable ? "d-block" : "d-none")
                          }
                          aria-hidden="true"
                          data-tip
                          data-for="tt_email"
                        />
                        <ReactTooltip id="tt_email" type="dark" effect="solid">
                          <p className="tooltip-ts">
                            {this.state.info.tt_email}
                          </p>
                        </ReactTooltip>
                      </label>
                    </div>
                    <div className="form-group col-md-8">
                      <input type="text"
                        className="form-control"
                        name="email"
                        id="email"
                        value={this.state.email}
                        placeholder={CONSTANTS_CREATE_USER.EMAIL}
                        onChange={this.handleAction}
                        onBlur={this.emailIsUnique}
                        maxLength="50"
                      />

                      {!this.state.isUniqueEmail ? this.emailExists() : ""}
                      {this.state.emailRequired == true
                        ? this.emailRequiredError()
                        : ""}
                      {/* {<div className="error">
                        {this.validator.message(
                          "Email",
                          this.state.email,
                          "required|email"
                        )}
                      </div>} */}
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-md-1" />
                    <div className="form-group col-md-4">
                      <label>
                        {CONSTANTS_CREATE_USER.PASSWORD}
                        <span className="text-danger">*</span>
                        <i
                          className={
                            "fa fa-info-circle float-right mt-1 ml-1 " +
                            (this.state.isTooltipEnable ? "d-block" : "d-none")
                          }
                          aria-hidden="true"
                          data-tip
                          data-for="tt_password"
                        />
                        <ReactTooltip
                          id="tt_password"
                          type="dark"
                          effect="solid"
                        >
                          <p className="tooltip-ts">
                            {this.state.info.tt_password}
                          </p>
                        </ReactTooltip>
                      </label>
                    </div>
                    <div className="form-group col-md-7">
                      <input
                        autoComplete="new-password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        id="password"
                        value={this.state.password}
                        onChange={this.handleAction}
                        disabled={this.state.isEditMode}
                        maxLength="20"
                      />
                      {
                        this.state.isEditMode ? "" :
                          <div className="error">
                            {this.validator.message(
                              "Password",
                              this.state.password,
                              "required:Password|strongPwdChecker"
                            )}
                          </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-md-1" />
                    <div className="form-group col-md-4">
                      <label>
                        {CONSTANTS_CREATE_USER.CONF_PASSWORD}
                        <span className="text-danger">*</span>
                      </label>
                    </div>
                    <div className="form-group col-md-7">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Confirm Password"
                        name="confPassword"
                        id="confPassword"
                        value={this.state.confPassword}
                        onChange={this.handleAction}
                        disabled={this.state.isEditMode}
                        maxLength="20"
                      />
                      {
                        this.state.isEditMode ? "" :
                          <div className="error">
                            {this.validator.message(
                              "Confirm Password",
                              this.state.confPassword,
                              "required:Confirm Password|confPasswordMatch:" +
                              this.state.password
                            )}
                          </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-4">
                  <div className="row">
                    <div className="form-group col-md-4">
                      <label>
                        {CONSTANTS_CREATE_USER.ASSIGN_FULFILLMENT_ZONE}
                        <span className="text-danger">*</span>
                        <i
                          className={
                            "fa fa-info-circle float-right mt-1 ml-1 " +
                            (this.state.isTooltipEnable ? "d-block" : "d-none")
                          }
                          aria-hidden="true"
                          data-tip
                          data-for="tt_zone"
                        />
                        <ReactTooltip id="tt_zone" type="dark" effect="solid">
                          <p className="tooltip-ts">
                            {this.state.info.tt_zone}
                          </p>
                        </ReactTooltip>
                      </label>
                    </div>
                    <div className="form-group col-md-8">
                      <ApolloProvider client={this.client}>
                        <select
                          className="form-control"
                          id="fulfillmentZone"
                          name="fulfillmentZone"
                          onChange={this.selectZone}
                          value={this.state.fulfillmentZone}
                        >
                          <option value="default">
                            {CONSTANTS_CREATE_USER.NONE}
                          </option>
                          <FulfillmentZone />
                        </select>
                      </ApolloProvider>
                      <div className="error">
                        {this.validator.message(
                          "fulfillmentZone",
                          this.state.fulfillmentZone,
                          "checkSelect"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="row">
                    <div className="col-md-1" />
                    <div className="form-group col-md-4">
                      <label>
                        {CONSTANTS_CREATE_USER.ASSIGN_ROLE}
                        <span className="text-danger"> *</span>
                        <i
                          className={
                            "fa fa-info-circle float-right mt-1 ml-1 " +
                            (this.state.isTooltipEnable ? "d-block" : "d-none")
                          }
                          aria-hidden="true"
                          data-tip
                          data-for="tt_assign_role"
                        />
                        <ReactTooltip
                          id="tt_assign_role"
                          type="dark"
                          effect="solid"
                        >
                          <p className="tooltip-ts">
                            {this.state.info.tt_assign_role}
                          </p>
                        </ReactTooltip>
                      </label>
                    </div>
                    <div className="form-group col-md-7">
                      <ApolloProvider client={this.client}>
                        <select
                          className="form-control"
                          id="assignedRole"
                          name="assignedRole"
                          onChange={this.selectRole}
                          value={this.state.assignedRole}
                        >
                          <option value="default">
                            {CONSTANTS_CREATE_USER.NONE}
                          </option>
                          <Roles />
                        </select>
                      </ApolloProvider>
                      <div className="error">
                        {this.validator.message(
                          "assignedRole",
                          this.state.assignedRole,
                          "checkSelect"
                        )}
                      </div>
                    </div>
                  </div>
                </div>


                <div className="col-md-4" >
                  <div className="row">
                    <div className="col-md-1" />
                    <div className="form-group col-md-4" >
                      <label>
                        {CONSTANTS_CREATE_USER.USER_PIN}
                        <span className="text-danger">*</span>
                        <i
                          className={
                            "fa fa-info-circle float-right mt-1 ml-1 " +
                            (this.state.isTooltipEnable ? "d-block" : "d-none")
                          }
                          aria-hidden="true"
                          data-tip
                          data-for="tt_pin"
                        />
                        <ReactTooltip id="tt_pin" type="dark" effect="solid">
                          <p className="tooltip-ts">{this.state.info.tt_pin}</p>
                        </ReactTooltip>
                      </label>
                    </div>
                    <div className="form-group col-md-7">
                      <ReactCodeInput
                        name="pin"
                        value={this.state.pin}
                        onChange={this.pinChange}
                        id="pin"
                        type="text"
                        fields={4}
                        autoFocus={false}
                        pattern="[0-9]"
                        disabled={this.state.isEditMode}
                      />
                      {
                        this.state.isEditMode ? "" :
                          <div className="error">
                            {this.validator.message(
                              "pin",
                              this.state.pin,
                              "required:Pin|numeric|checkLength:4"
                            )}
                          </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-12" />
                <div className="form-group">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onChange={this.changePassword}
                      defaultChecked={this.state.changePassword}
                    />
                    <label className="form-check-label checkbox-pt">
                      {CONSTANTS_CREATE_USER.CHANGE_PASSWORD}
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-row float-right">
                <button
                  type="button"
                  onClick={() => this.formReset()}
                  className={
                    this.props.stateOfUser.status
                      ? "btn btn-danger disabled mr-2"
                      : "btn btn-danger mr-2"
                  }
                >
                  {CONSTANTS_CREATE_USER.CANCEL_BTN}
                </button>

                <button
                  type="button"
                  onClick={() => this.submitHandler()}
                  className={
                    this.props.stateOfUser.status
                      ? "btn btn-primary disabled"
                      : "btn btn-primary"
                  }
                >
                  {(this.state.isEditMode) ? CONSTANTS_CREATE_USER.UPDATE_BTN : CONSTANTS_CREATE_USER.CREATE_BTN}
                </button>
              </div>
            </CardBody>
          </Card>
        </form>

        <UserList />
      </div>
    );
  }

  usernameError = () => {
    return (
      <div className="error">
        <p>{CONSTANTS_CREATE_USER.USERNAME_INFO}</p>
      </div>
    );
  };

  isUniqueUserError = () => {
    return (
      <div className="error">
        <p className="srv-validation-message">
          {CONSTANTS_CREATE_USER.USERNAME_EXISTS_INFO}
        </p>
      </div>
    );
  };

  emailError = () => {
    return (
      <div className="error">
        <p className="srv-validation-message">
          {CONSTANTS_CREATE_USER.USERNAME_EMAIL_VLD_INFO}
        </p>
      </div>
    );
  };

  emailExists = () => {
    return (
      <div className="error">
        <p className="srv-validation-message">
          {CONSTANTS_CREATE_USER.EMAIL_EXISTS_INFO}
        </p>
      </div>
    );
  };

  emailValidationError = () => {
    return (
      <div className="error">
        <p className="srv-validation-message">
          {CONSTANTS_CREATE_USER.EMAIL_INFO}
        </p>
      </div>
    );
  };

  usernameRequiredError = () => {
    return (
      <div className="error">
        <p className="srv-validation-message">Username is required.</p>
      </div>
    );
  };
  emailRequiredError = () => {
    return (
      <div className="error">
        <p className="srv-validation-message">Email is required.</p>
      </div>
    );
  };
}

const mapDispatchToProps = {
  create_user: create_user,
  reset_action: reset_action,
  currentRoute: currentRoute,
  fetch_helpertext: fetch_helptext,
  reset_helpertext: reset_helpertext,
  reset_edit_user,
  update_user,
  update_user_reset,
};

const mapStateToProps = state => {
  return {
    stateOfAction: state.user,
    stateOfUser: state.create_user,
    stateOfGenerics: state.reducer_state,
    stateOfEditUser: state.edit_user,
    stateOfUpdateUser: state.update_user
  };
};

CreateUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUser);

export default CreateUser;
