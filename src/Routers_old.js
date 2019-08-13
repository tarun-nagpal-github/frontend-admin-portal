import React from "react";
import { Switch, Route } from "react-router-dom";
import Base from "./components/Layout/Base";
import Basepages from "./components/Layout/Basepages";
import Login from "./components/Authentication/Login/Login";
import Register from "./components/Authentication/Register/Register";
import Blankpage from "./components/Custompage/Blankpage/Blankpage";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateUser from "./components/Users/CreateUser";
import { ComingSoon } from "./components/Custompage/ComingSoon/ComingSoon";
import { UnAuthorised } from "./components/Custompage/UnAuthorised/UnAuthorised";
import ReceivingAtDock from "./components/Receiving/ReceivingAtDock";
import ReceivingAtDockDashboard from "./components/Receiving/ReceivingAtDockDashboard";
import Permissions from "./components/Permissions/Permissions";
import CreateRole from "./components/Roles/CreateRole";
import UserList from "./components/Users/UserList";
import { Redirect } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import LoginRedirect from "./LoginRedirect";
import RoleLsist from "./components/Roles/RolesList";
import ReceivingMaster from "./components/ReceivingWorkflow/ReceivingMaster";
import ForgotPassword from "./components/Authentication/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/Authentication/ResetPassword/ResetPassword";
import ChangePassword from "./components/Authentication/ChangePassword/ChangePassword";

const listofPages = ["#/login", "#/register", "#/forgot-password"];

const Routers = props => {
  if (listofPages.indexOf(location.hash) > -1 || checkIfResetPasswordCalled() != null) {
    return (
      <Basepages>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
      </Basepages>
    );
  } else {
    return (
      <Base>
        <LoginRedirect />
        <Switch>
          <ProtectedRoute exact path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/receiving-at-dock" component={ReceivingAtDock} />
          <ProtectedRoute
            path="/receiving-at-dock-dashboard"
            component={ReceivingAtDockDashboard}
          />
          <Route path="/un-authorised" component={UnAuthorised} />
          <ProtectedRoute exact path="/coming-soon" component={ComingSoon} />
          <ProtectedRoute path="/blankpage" component={Blankpage} />
          <ProtectedRoute path="/create-user" component={CreateUser} />
          <ProtectedRoute path="/users-list" component={UserList} />
          <ProtectedRoute path="/create-permissions" component={Permissions} />
          <ProtectedRoute path="/user-roles" component={CreateRole} />
          <ProtectedRoute path="/user-roles-list" component={RoleLsist} />
          <ProtectedRoute path="/receiving-workflow" component={ReceivingMaster} />
          <Route path="/change-password" component={ChangePassword} />
          <ProtectedRoute component={Dashboard} />
        </Switch>
      </Base>
    );
  }
};

const checkIfResetPasswordCalled = () => {
  return location.hash.match(/reset-password/g);
};

export default Routers;