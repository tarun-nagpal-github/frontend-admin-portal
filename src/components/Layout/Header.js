import React, { Component } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../reduxUtils/actions/auth";
import { get_user_meta_info, reset_meta_info } from "../../reduxUtils/actions/users";
import { get_permitted_pages_reset } from "../../reduxUtils/actions/permissions/permissions";
import { connect } from "react-redux";
import { ApolloProvider } from "react-apollo";
import FulfillmentZone from "../Elements/FulfillmentZone";
import endpoint from "../../config/endpoints";
import { apolloClientGraphQL, profileLogo } from "../../utils/HelperFunctions";
import { edit_reciept_reset, getReceivingCountAction } from "../../reduxUtils/actions/receiving";
import {store_zone} from "../../reduxUtils/actions/storeZone";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggleactive: false,
      defaultValue: 1,
      authToken: this.props.stateOfAction.authToken,
      zone: "0",
      userDetails: {
        userName: "JohnDoe",
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@gmail.com",
        role: "Doe",
        roleId: 0
      }
    };
    this.togglebutton = this.togglebutton.bind(this);
  }
  togglebutton(toggleactive) {
    this.props.updateParent();
  }

  componentWillMount() {
    if (this.props.stateOfAction.authToken) {
      this.props.get_user_meta_info(this.state);
    }
    this.client = apolloClientGraphQL(endpoint.GRAPHQL_URL);
  }

  fetchFulfilmentZone() {
    if (this.props.stateReciept.status == 200) {
      let formValues = this.props.stateReciept.recieptDetails;
      this.setState(
        {
          zone: formValues.idFulfillmentZone
        },
        () => {
          this.props.store_zone({zone:this.state.zone});
          // this.props.edit_reciept_reset();
        }
      );
    }
  }

  getUserDetails() {
    if ((this.props.userMeta.status == 200) && (this.props.userMeta.response)) {
      this.setState({
        userDetails: (this.props.userMeta.response)
      },
        () => {
          this.props.store_zone({zone: this.state.userDetails.idFulfillmentZone});
          this.props.reset_meta_info();
        });
    }
  };

  handleZoneChange = (e) => {
    this.setState({
      zone: e.target.value
    },() => {
      this.props.store_zone({zone:this.state.zone});
      this.props.getReceivingCountAction({zone:this.state.zone});
    });
  }

  render() {
    // fulfilment zone value rendering
    this.fetchFulfilmentZone();
    if (this.props.stateOfAction.authToken) {
      this.getUserDetails();
    }

    return (
      <nav className="admin-header navbar navbar-default col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-left navbar-brand-wrapper">
          <Link className="navbar-brand brand-logo" to="/">
            <img src="assets/images/logo-dark.png" alt="Logo" />
          </Link>
        </div>
        {/* <!-- Top bar left --> */}
        <ul className="nav navbar-nav mr-auto">
          <li className="nav-item">
            <a
              className="button-toggle-nav inline-block ml-20 pull-left"
              onClick={this.togglebutton}
              href="javascript:void(0);"
            >
              <i className="zmdi zmdi-menu ti-align-right" />
            </a>
          </li>
        </ul>


        {/* <!-- top bar right --> */}
        <ul className="nav navbar-nav ml-auto">
          <li className="nav-item dropdown ">
            {/* <a
              className="nav-link top-nav"
              data-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="ti-bell" />
              <span className="badge badge-danger notification-status"> </span>
            </a> */}

            {/* <div className="dropdown-menu dropdown-menu-right dropdown-big dropdown-notifications">
              <div className="dropdown-header notifications">
                <strong>Notifications</strong>
                <span className="badge badge-pill badge-warning">05</span>
              </div>

              <div className="dropdown-divider" />
              <a href="#" className="dropdown-item">
                New registered user{" "}
                <small className="float-right text-muted time">Just now</small>{" "}
              </a>
              <a href="#" className="dropdown-item">
                New invoice received{" "}
                <small className="float-right text-muted time">22 mins</small>{" "}
              </a>
              <a href="#" className="dropdown-item">
                Server error report
                <small className="float-right text-muted time">
                  7 hrs
                </small>{" "}
              </a>
              <a href="#" className="dropdown-item">
                Database report
                <small className="float-right text-muted time">
                  1 days
                </small>{" "}
              </a>
              <a href="#" className="dropdown-item">
                Order confirmation
                <small className="float-right text-muted time">
                  2 days
                </small>{" "}
              </a>
            </div> */}
          </li>
          {/* <li className="nav-item dropdown" >

          </li> */}

          <li className="nav-item">
            <div className="search">
              <a className="search-btn not_click" href="javascript:void(0);" />
              <div className="search-box not-click">
                <input
                  type="text"
                  className="not-click form-control"
                  placeholder="Search"
                  name="search"
                />
                <button className="search-button" type="submit">
                  {" "}
                  <i className="fa fa-search not-click" />
                </button>
              </div>
            </div>
          </li>

          <li className="nav-item fullscreen">
            {/* <a id="btnFullscreen" className="nav-link">
              <i className="ti-fullscreen" />
            </a> */}
            <div className="clientSelection">
              <ApolloProvider client={this.client}>
                <select
                  className="form-control"
                  id="zone"
                  name="zone"
                  onChange={(e) => this.handleZoneChange(e)}
                  value={this.props.stateOfZone.zone}
                >
                  <option value="0">Select Zone</option>
                  <FulfillmentZone param={this.props.stateOfZone.zone}/>
                </select>
              </ApolloProvider>
            </div>
          </li>
          <li className="nav-item dropdown mr-30" style={{ cursor: "pointer" }}>
            <img src="/assets/images/UserLogo.png" className="img-fluid-extron" />
            <div className="dropdown-menu dropdown-menu-right">
              <div className="dropdown-header">
                <div className="media">
                  <div className="media-body">
                    <h5 className="mt-0 mb-0">{this.state.userDetails.firstName} {this.state.userDetails.lastName}</h5>
                    <span>{this.state.userDetails.email}</span>
                  </div>
                </div>
              </div>
              <div className="dropdown-divider" />
              {/* <a className="dropdown-item" href="#">
                <i className="text-secondary ti-reload" />
                Activity
              </a> */}
              {/* <a className="dropdown-item" href="#">
                <i className="text-success ti-email" />
                Messages
              </a> */}
              <a className="dropdown-item" href="#">
                <i className="text-warning ti-user" />
                Profile
              </a>
              <div className="dropdown-divider" />
              <a className="dropdown-item" href="#/change-password">
                <i className="text-primary fa fa-key" />
                Change Password
              </a>
              {/* <a className="dropdown-item" href="#">
                <i className="text-dark ti-layers-alt" />
                Projects <span className="badge badge-info">6</span>{" "}
              </a> */}
              <div className="dropdown-divider" />
              {/* <a className="dropdown-item" href="#">
                <i className="text-info ti-settings" />
                Settings
              </a> */}

              <a
                className="dropdown-item"
                onClick={() => {                          
                  this.props.get_permitted_pages_reset(this.state);                  
                  this.props.logout(this.state.authToken);
                }}
                href="#"
              >
                <i className="text-danger ti-unlock" />
                Logout
              </a>
              {/*
              <a

                  className={`button   ${this.isFormValid() ? "" : "disabled"}`}
                > */}
            </div>
          </li>
        </ul>
      </nav>
      //   End Header
    );
  }
}

const mapDispatchToProps = {
  logout: logout,
  edit_reciept_reset,
  store_zone,
  get_user_meta_info: get_user_meta_info,
  reset_meta_info: reset_meta_info,
  get_permitted_pages_reset,
  getReceivingCountAction
};

const mapStateToProps = state => {
  return {
    stateOfAction: state.user,
    userMeta: state.user_meta,
    stateReciept: state.edit_receiving,
    stateOfZone: state.storeZoneReducer
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
