import React from "react";
import { connect } from "react-redux";
import { currentRoute } from "../../reduxUtils/actions/currentRoute";
import { get_users, reset_action, reset_user_list, delete_users, delete_users_reset, edit_user, reset_edit_user } from "../../reduxUtils/actions/users";

import ExtronTable from "../Elements/ExtronTable";
import { noRecordsAvailable } from "../Elements/NoRecordsAvailable";
import { Loader } from "react-overlay-loader";
import { Redirect } from "react-router";
import CONSTANTS from "../../config/constants.json";
import {
  Card, CardBody, Modal, ModalHeader,
  Button, ModalFooter, Spinner
} from "reactstrap";
import "./CreateUser.scss";

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {},
      selectAll: 0,
      startIndex: 0,
      endIndex: 100,
      authToken: this.props.stateOfLogin.authToken,
      allUserList: {},
      status: null,
      loader: true,
      redirectTo: false,
      isDelete: false,
      actionItem: "get"
    };
    this.selectedRowsTemp = [];
  }

  componentWillMount() {
    this.props.reset_user_list();
    this.props.currentRoute(location.hash); // TODO: refine this service
    this.props.get_users(this.state);
  }

  deleteUser = e => {
    this.props.delete_users(this.state);
  };

  editUser = e => { };

  toggleRow = idUser => {
    const newSelected = Object.assign({}, this.state.selected);
    newSelected[idUser] = !this.state.selected[idUser];
    this.setState({
      selected: newSelected,
      selectAll: 2
    });
  };

  toggleSelectAll = () => {
    let newSelected = {};

    if (this.state.selectAll === 0) {
      this.state.allUserList.forEach(x => {
        newSelected[x.idUser] = true;
      });
    }

    this.setState({
      selected: newSelected,
      selectAll: this.state.selectAll === 0 ? 1 : 0
    });
  };

  loadExtronTable = () => {
    return (
      <ExtronTable
        parentRecords={this.state.allUserList}
        parentColumns={this.columns}
        defaultSorted={[{ id: "firstName", desc: true }]}
        filterable={true}
        minRows={0}
        defaultPageSize={10}
        showPaginationBottom={true}
        showPaginationTop={false}
        classes="-striped -highlight"
      />
    )
  }

  addUser = () => {
    this.setState({
      redirectTo: true
    })
  }

  goToPage = () => {
    if (this.state.redirectTo) {
      return <Redirect to="/create-user" />
    }
  }

  getUsersListResponse = () => {
    if (this.props.stateOfGetUsers.status == 200) {
      this.props.reset_user_list();
      this.setState({
        allUserList: this.props.stateOfGetUsers.data,
        status: this.props.stateOfGetUsers.status,
        loader: false
      });
    }

    if (this.props.stateOfUser.status == 200) {
      this.props.get_users(this.state);
      this.props.reset_action();
    }
  }

  deleteUserResponse = () => {
    if (this.props.stateOfDeleteUsers.status == 200) {
      swal(CONSTANTS.USERS.DELETE_SUCCESS);
      this.props.get_users(this.state);
      this.props.delete_users_reset();
    } else if (this.props.stateOfDeleteUsers.status == 400) {
      swal(CONSTANTS.USERS.DELETE_FAILURE);
      this.props.delete_users_reset();
    }
  }

  confirmDelete = () => {
    if (Object.keys(this.state.selected).length > 0) {
      this.setState(
        {
          isDelete: true
        }
      );
    } else {
      swal(CONSTANTS.RECEIVING_DASHBOARD.EMPTY_MSG_DELETE);
    }
  }



  onDeleteConfirm = () => {
    this.setState({
      isDelete: false
    });
    this.props.delete_users(this.state);
  }

  hideDeleteAlert = () => {
    this.setState({
      isDelete: false
    });
  };


  editUserAction = (idUser = 0) => {
    this.setState({ idUser }, () => this.props.edit_user(this.state));
  }

  isRecordsAvailable = () => {
    return (this.state.allUserList && this.state.allUserList.length > 0);
  }
  render() {
    this.getUsersListResponse();
    this.deleteUserResponse();
    this.columns = [
      {
        Header: "Action",
        id: "checkbox",
        width: 40,
        accessor: "",
        sortable: false,
        filterable: false,
        Cell: ({ original }) => {
          return (
            <div className="text-center">
              <input
                type="checkbox"
                checked={this.state.selected[original.idUser] === true}
                onChange={() => this.toggleRow(original.idUser)}
              />
            </div>
          );
        },
        Header: x => {
          return (
            <input
              type="checkbox"
              className="checkbox"
              checked={this.state.selectAll === 1}
              ref={input => {
                if (input) {
                  input.indeterminate = this.state.selectAll === 2;
                }
              }}
              onChange={() => this.toggleSelectAll()}
            />
          );
        }
      },
      {
        Header: "First Name",
        id: "firstName",
        accessor: d => d.firstName
      },
      {
        Header: "Last Name",
        id: "lastName",
        accessor: d => d.lastName
      },
      {
        Header: "E-mail",
        id: "email",
        accessor: d => d.email
      },
      {
        Header: "Role",
        id: "role",
        accessor: d => d.roleName
      },
      {
        Header: "Fulfilment Zone",
        id: "fZone",
        accessor: d => d.fulfillmentZone
      },
      {
        Header: "Action",
        id: "action",
        accessor: d => d.fulfillmentZone,
        Cell: ({ original }) => {
          return (
            <i className="fa fa-edit fa-2x" onClick={() => this.editUserAction(original.idUser)} style={{ cursor: "pointer" }} title="Click here to edit"></i>
          );
        }
      }
    ];



    return (
      <div className="mb-90">
        {this.state.redirectTo ? this.goToPage() : ""}
        <Loader loading={this.state.loader} />


        <Modal isOpen={this.state.isDelete}>
          <ModalHeader>{CONSTANTS.DELETE_RECIEPT.CONFIRM_DELETE}</ModalHeader>
          <ModalFooter>
            <Button color="danger" onClick={this.onDeleteConfirm}>
              {CONSTANTS.GENERIC.BUTTONS.OK}
            </Button>
            <Button color="secondary" onClick={this.hideDeleteAlert}>
              {CONSTANTS.GENERIC.BUTTONS.CANCEL}
            </Button>
          </ModalFooter>
        </Modal>
        <div className="page-title">
          <div className="row user-list-second">
            <div className="col-sm-6">
              <h6 className="mb-0">User List</h6>
            </div>
            {/* <div className="col-sm-6">
              <nav
                className="float-left float-sm-right"
                aria-label="breadcrumb"
              >
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Users</a>
                  </li>
                  <li className="active breadcrumb-item" aria-current="page">
                    List of Users
                  </li>
                </ol>
              </nav>
            </div> */}
          </div>
        </div>
        <Card className="card-statistics h-100">
          <CardBody>
            <div className="row">
              <div className="col-md-2">
                {/* <select className="form-control mb-2">
                <option>Column Filter</option>
                  <option>Column 1</option>
                  <option>Column 2</option>
                  <option>Column 3</option>
                </select> */}
              </div>
              {(this.isRecordsAvailable()) &&
                <div className="col-md-10" >
                  <input
                    type="button"
                    className="btn btn-danger mt-2 mb-3 float-right"
                    value="Delete"
                    onClick={() => this.confirmDelete()}
                  />
                  {/* <input
         type="button"
         className="btn btn-primary mt-2 mr-2 float-right"
         value="Add User"
         onClick={() => this.addUser()}
       /> */}
                </div>
              }

            </div>
            {
              /* rendering datatable */
              (this.isRecordsAvailable())
                ? this.loadExtronTable()
                : noRecordsAvailable("No User Found.", "")
            }
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapDispatchToProps = {
  currentRoute, get_users, delete_users,
  reset_user_list, delete_users_reset,
  edit_user, reset_edit_user, reset_action
};

const mapStateToProps = state => {
  return {
    stateOfLogin: state.user,
    stateOfGetUsers: state.get_users,
    stateOfDeleteUsers: state.delete_users,
    stateOfUser: state.create_user,
  };
};

UserList = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);
export default UserList;
