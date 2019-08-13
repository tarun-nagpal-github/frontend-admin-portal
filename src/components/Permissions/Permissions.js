import React from "react";
import "./Permission.scss";
import { Card, CardBody, CardTitle, Row, Col, ListGroup, ListGroupItem, Button } from "reactstrap";
import { fetch_roles, fetch_roles_reset } from "../../reduxUtils/actions/roles";
import { fetch_modules, fetch_modules_reset, save_permissions, save_permissions_reset, fetch_actions, fetch_actions_reset } from "../../reduxUtils/actions/permissions/permissions";
import { connect } from "react-redux";
import { Loader } from "react-overlay-loader";
import { ucfirst } from "../../utils/HelperFunctions";
import { ToastContainer, toast } from "react-toastify";
import NoRecordsFound  from "./NoRecords/NoRecords";

class Permissions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabbordericon: "1",
      userRoles: [],
      moduleData: [],
      loader: true,
      actionLoader: false,
      authToken: this.props.stateOfAction.authToken,
      idUserRole: 0,
      idUserModule: 0,
      idUserModulePage: 0,
      actionsViewModels: [],
      currentModule: [],
      actionList: [],
      fetchActionsQuery: null,
      moduleList: [],
      pageList: [],
      showModuleSelection: true,
      showPageSelection: true,
      noRecordsFound: false
    };
  }

  tabbordericon = tab => {
    if (this.state.tabbordericon !== tab) {
      this.setState({
        tabbordericon: tab
      });
    }
  };

  componentWillMount() {
    this.props.fetch_roles();
    this.props.fetch_modules(this.state);
  }

  handleChange = (e) => {
    let name = e.currentTarget.getAttribute('name');
    let value = e.currentTarget.getAttribute('value');
    // check if module clicked
    if(name == "idUserModule") {      
      let temp2 = this.state.moduleData.filter(object => object.idUserModule == value);
      if(Array.isArray(temp2) && (temp2.length > 0) && (temp2[0].modulePages)) {        
          // Set the pageList 
          this.setState({
            pageList: temp2[0].modulePages,
            actionList: [],
            showPageSelection: false,
            showModuleSelection: true
          });
      }
    } else {
      // Unset the pageList 
      this.setState({
        pageList: [],
        actionList: [],
        showModuleSelection: false,        
      });
    }
    
    this.setState({
      [name]: value,
      actionsViewModels: []
    });    
  }

  fetchActions = (e) => {
    let query = `
    {
      roles(id:${this.state.idUserRole}){    
       userModulePageActions{
        pageId
        page
        actionId
        action
        roleIsActive  
        isAssisned  
      }
     }
    }
      `
    this.setState({
      [e.currentTarget.getAttribute('name')]: e.currentTarget.getAttribute('value'),
      actionsViewModels: [],
      fetchActionsQuery: query,
      actionLoader: true,
      showPageSelection: true
    }, () => { 
      this.props.fetch_actions(this.state);
    });

  }




  updatePermission = (e) => {
    let action = {
      idUserAction: e.currentTarget.id,
      isActive: e.currentTarget.checked
    };

    let temp = this.state.actionList;

    let isOldValueChecked = false;

    // console.log(this.state.actionList);
    // Update Value if Exists
    temp.map(
      (project) => {
        if (project.actionId == e.currentTarget.id) {
          isOldValueChecked = true;          
          return project.roleIsActive  = e.currentTarget.checked
        } else {
          return project.roleIsActive;
        }
      }
    ); 

    if (!isOldValueChecked) {
      temp.push(action);
    }

    this.setState({
      actionList: temp
    }, () => {
      // console.log(this.state.actionList);
    });
  }


  GetUserList = () => {
    return (
      <ListGroup>
        {this.state.userRoles.map((item) => {
          return (
            <ListGroupItem name="idUserRole" active={this.state.idUserRole == item.roleId} onClick={this.handleChange} value={item.roleId} action key={item.roleId} id={item.roleId}>{item.roleName}</ListGroupItem>
          );
        })}
      </ListGroup>
    );
  };

  GetModuleList = () => {
    return (
      <ListGroup>
        {this.state.moduleData.map((item) => {
          return (
            <ListGroupItem name="idUserModule" active={this.state.idUserModule == item.idUserModule && this.state.showModuleSelection} onClick={this.handleChange} value={item.idUserModule} action key={item.idUserModule} id={item.idUserModule}>{item.userModuleName}</ListGroupItem>
          );
        })}
      </ListGroup>
    );
  };

  getCurrentModule = () => {    
    let temp = this.state.moduleData.find(item => item.idUserModule == this.state.idUserModule);    
    this.setState({currentModule : temp});    
    return temp;
  }

  getCurrentPage = () => {
    return this.currentModule.modulePages.find(item => item.idUserModulePage == this.state.idUserModulePage);
  }

  isModuleExists = () => {
    return (Array.isArray(this.state.moduleData) && this.state.moduleData.length > 0);
  }

 
  GetPageList = () => {    
    if ((this.isModuleExists()) && (this.state.pageList.length > 0)) {  
      return (
        <ListGroup>
          {this.state.pageList.map((item) => {
            return (
              <ListGroupItem name="idUserModulePage" active={this.state.idUserModulePage == item.idUserModulePage && this.state.showPageSelection } onClick={this.fetchActions} key={item.idUserModulePage} value={item.idUserModulePage}>{item.pageName}</ListGroupItem>
            );
          })}
        </ListGroup>
      );
    }
    return <NoRecordsFound />;
  };



  GetActionList = () => {
    if (this.state.actionList.length > 0) { 
      return (
        <React.Fragment>
          {this.state.actionList.map((item) => {
            let currentIndex = (this.state.actionList.findIndex(record => record.actionId == item.actionId));
            return (
              <Col className="action" sm={4}>
                <input
                  className="checkBox"
                  type="checkbox"
                  name="action"
                  id={item.actionId}                  
                  value={item.roleIsActive}
                  onChange={this.updatePermission}                  
                  checked={this.state.actionList[currentIndex].roleIsActive}
                />
                {ucfirst(item.action)}
              </Col>
            );
          })}
        </React.Fragment>
      );
    }

    return <NoRecordsFound />;
  };

  checkRoleStatus = () => {
    // Fetch Roles 
    if (this.props.stateRoles.statusCode == 200) {
      this.setState({
        userRoles: this.props.stateRoles.data.roles,
        loader: false
      });
      this.props.fetch_roles_reset();
    }
    // Fetch Modules
    if (this.props.stateModules.status == 200) {
      this.setState({
        moduleData: this.props.stateModules.data.modules,
        loader: false
      });
      this.props.fetch_modules_reset()
    }

    // // Fetch Modules
    // if (this.props.stateModules.status == 200) {
    //   this.setState({
    //     loader: false
    //   });      
    //   this.props.save_permissions_reset();
    // } else if (this.props.stateModules.status == 400) {
    //   this.setState({
    //     loader: false
    //   });      
    //   this.props.save_permissions_reset();
    // }

    // Fetch Save resposne     
    if (this.props.stateSavePermissions.status == 200) {      
      this.setState({actionLoader: false});
      toast.success("Saved Permission");
      this.props.save_permissions_reset();
    } else if (this.props.stateSavePermissions.status == 400) {
      toast.error("UNABLE to Save.");
      this.props.save_permissions_reset();
    }

    let actionsReducer = this.props.fetchActionsReducer;
    if (actionsReducer.status == 200) {
      if (Array.isArray(actionsReducer.data.roles) && (actionsReducer.data.roles.length > 0)) {
        let totalActions = actionsReducer.data.roles[0].userModulePageActions;
        var totalActionsFilter = totalActions.filter(item => item.pageId == this.state.idUserModulePage);
        this.setState({
          actionList: totalActionsFilter,
          actionLoader: false
        });
      }
      this.props.fetch_actions_reset();
    }
  };

  updateIndexes = () => {
    let temp = this.state.actionList.map(a => { return { ...a } })
    temp.forEach((data) => {
      data['idUserAction'] = data['actionId'];
      data['isActive'] = data['roleIsActive'];
      delete data['actionId'];
      delete data['action'];
      delete data['page'];
      delete data['pageId'];
      delete data['roleIsActive'];
      delete data['isAssisned'];
    });
    this.setState({
      actionsViewModels: temp,
      actionLoader: true
    }, () => {      
      this.props.save_permissions(this.state);
    })
  }

  savePermissions = () => {
    this.updateIndexes();
  }

  render() {
    this.checkRoleStatus();
    return (
      <div className="mb-90">
        <div className="page-title">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">Role Based Access Control</h3>
            </div>
            <ToastContainer />
            <div className="col-sm-6">
              <nav
                className="float-left float-sm-right"
                aria-label="breadcrumb"
              >
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Settings</a>
                  </li>
                  <li className="active breadcrumb-item" aria-current="page">
                    Permissions
                    </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        <Row>
          {/* <Col sm={4}>
              <RolesList />
            </Col> */}
          <Col sm={12}>
            <Card>
              <CardBody>
                {/* <Row>
                    <Col sm={12}>
                      <h2 className="perHeading">Permission Matrix</h2>
                    </Col>
                  </Row> */}
                <Row className="rbac">
                  <Col sm={2} className="modules">
                    <Card>
                      <CardBody>
                        <Loader loading={this.state.loader} />
                        <CardTitle>Roles</CardTitle>
                        <this.GetUserList />
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm={2} className="modules">
                    <Card>
                      <CardBody>
                        <Loader loading={this.state.loader} />
                        <CardTitle>Modules</CardTitle>
                        <this.GetModuleList />
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm={2} className="pages">
                    <Card>
                      <CardBody>
                        <CardTitle>Pages</CardTitle>
                        <this.GetPageList />
                      </CardBody>
                    </Card>
                  </Col>
                  {/* {(this.state.actionList.length > 0) && */}
                  <Col sm={6} className="actions">
                    <Card>
                      <CardBody>
                        <CardTitle>Actions</CardTitle>
                        <Row className="row" >
                          <Loader loading={this.state.actionLoader} />
                          <this.GetActionList />
                        </Row>
                        {(this.state.actionList.length > 0) &&
                          <Row className="footerButton">
                            <Col className="text-center text-md-right" >
                              <Button color="secondary" onClick={() => this.savePermissions()}>Save Permissions</Button>
                            </Col>
                          </Row>
                        }
                      </CardBody>
                    </Card>
                  </Col>
                  {/* } */}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    stateRoles: state.fetchRolesReducer,
    stateModules: state.permissionsReducer,
    stateSavePermissions: state.savePermissionsReducer,
    stateOfAction: state.user,
    fetchActionsReducer: state.fetchActionsReducer
  };
};

const mapDispatchToProps = {
  fetch_roles, fetch_roles_reset,
  fetch_modules, fetch_modules_reset,
  save_permissions, save_permissions_reset,
  fetch_actions, fetch_actions_reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Permissions);
