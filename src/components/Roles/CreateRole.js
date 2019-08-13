import React from "react";
import "./CreateRole.scss";
import SimpleReactValidator from "simple-react-validator";
import { create_role, update_roles, update_roles_reset, create_role_reset } from "../../reduxUtils/actions/roles";
import { connect } from "react-redux";
import { Loader } from "react-overlay-loader";
import { currentRoute } from "../../reduxUtils/actions/currentRoute";
import CONSTANTS from "../../config/constants.json";
import { Button, Row, Col } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";

class CreateRole extends React.Component {
  constructor(props) {
    super(props);
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
    this.state = {
      roleName: "",
      isActive: true,
      userType: "1",
      authToken: this.props.stateOfAction.authToken,
      modal: false,
      roleId: [],
      actionState: "create",
      btnText: "Add Role",
      addModeIsEnable: true
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      roleId: nextProps.parentState.roleId,
      roleName: nextProps.parentState.roleName,
      actionState: nextProps.parentState.actionState,
      btnText: nextProps.parentState.btnText,
      addModeIsEnable: nextProps.parentState.addModeIsEnable
    });
  }

  componentWillMount() {
    this.props.currentRoute(location.hash); // TODO: refine this service
  }

  handleAction = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  submitHandler = () => {
    if (this.validator.allValid()) {
      if (this.state.addModeIsEnable) {
        this.props.create_role(this.state);
      } else {
        this.props.update_roles(this.state);
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  responseList = () => {
    if (this.props.stateOfUpdateRole.status == 200) {
      toast.success(CONSTANTS.GENERIC.ROLE_UPDATED_SUCCESS);
      this.setState({
        roleName: "",
        addModeIsEnable: true,
      });
      this.props.update_roles_reset();
    }
    if (this.props.stateOfUpdateRole.status == 400) {
      toast.error(this.props.stateOfUpdateRole.errors[0]);
      this.props.update_roles_reset();
    }
    if (this.props.stateOfRoleReducer.status == 200) {
      toast.success(CONSTANTS.GENERIC.ROLE_CREATED_SUCCESS);
      this.setState({
        roleName: ""
      });
    }
    if (this.props.stateOfRoleReducer.status == 400) {
      toast.error(this.props.stateOfRoleReducer.errors[0]);
      this.setState({
        roleName: ""
      });
      this.props.create_role_reset()
    }
  }

  renderSubmitBtn = () => {
    return (
      <span style={{ cursor: "pointer" }} onClick={this.submitHandler} className="btn btn-primary mr-1">
        Add Role
      </span>
    );
  }

  renderEditButton = () => {
    return (
      <div>
        <span style={{ cursor: "pointer" }} onClick={this.submitHandler} className="btn btn-primary mr-1">
          Edit Role
        </span>
      </div>
    );
  }

  render() {
    this.responseList();
    return (
      <div>
        <div className="text-left">
          <ToastContainer />
        </div>
        <form>
          <div class="d-flex justify-content-center">
            <div className="card-body">
              {/* Role Name */}
              <div className="form-group row">
                <label className="col-md-3 col-form-label form-control-label">
                  Role Name
                    </label>
                <div className="col-md-6">
                  <input
                    id="roleName"
                    className="form-control"
                    type="text"
                    placeholder="Please enter Role Name"
                    value={this.state.roleName}
                    onChange={this.handleAction}
                  />

                  <div className="error text-left">
                    {this.validator.message(
                      "Role Name",
                      this.state.roleName,
                      "required:Role Name"
                    )}
                  </div>
                </div>
                <div className="col-md-3 text-left">
                  {
                    this.state.addModeIsEnable ? this.renderSubmitBtn() : this.renderEditButton()
                  }
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    leftNav: state.user.leftNav,
    stateOfAction: state.user,
    stateOfUpdateRole: state.updateRolesReducer,
    stateOfRoleReducer: state.roles,
  };
};

const mapDispatchToProps = {
  create_role: create_role,
  currentRoute: currentRoute,
  update_roles,
  update_roles_reset,
  create_role_reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateRole);
