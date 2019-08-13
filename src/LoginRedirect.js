import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import {
  currentRoute,
  reset_action
} from "./reduxUtils/actions/currentRoute";

class LoginRedirect extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return this.props.userStatus.loginSuccess == null ||
      this.props.userStatus.loginSuccess == false ? (
      <Redirect to="/login" />
    ) : <Redirect to={this.props.current_route.currentPage} /> ;
  }
}

const mapStateToProps = state => {
  return {
    userStatus: state.user,
    current_route: state.current_route
  };
};

const mapDispatchToProps = {
  currentRoute: currentRoute,
  reset_action: reset_action
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginRedirect);
