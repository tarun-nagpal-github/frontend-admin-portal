import React from "react";
import ReactTable from "react-table";
import "./RolesList.scss";
import CreateRole from "./CreateRole";
import { getDataGraphQL } from "../../services/CreateRole";
import { get_roles, get_roles_reset, create_role_reset, update_roles, update_roles_reset } from "../../reduxUtils/actions/roles";
import { connect } from "react-redux";
import { Loader } from "react-overlay-loader";
import ExtronTable from "../Elements/ExtronTable";
import { noRecordsAvailable } from "../Elements/NoRecordsAvailable";
import Switch from "react-switch";

class RolesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loader: true,
      selected: {},
      selectAll: 0,
      roleId: null,
      authToken: this.props.stateOfUser.authToken,
      addModeIsEnable: true,
      userType: "1"
    };
    this.selectedValues = [];
    this.columnDynamic();
  }

  changeEvent = (checked, e) => {
    this.setState({
      [e.target.id]: checked
    });
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    let result = await getDataGraphQL();
    this.setState({ data: result.data.data.roles, loader: false });
  };

  toggleRow = roleId => {
    const newSelected = Object.assign({}, this.state.selected);
    newSelected[roleId] = !this.state.selected[roleId];
    if (newSelected[roleId]) {
      this.selectedValues.push(roleId)
      this.setState({
        roleId: this.selectedValues
      });
    }

    if (!newSelected[roleId]) {
      var index = this.selectedValues.indexOf(roleId);
      if (index > -1) {
        this.selectedValues.splice(index, 1);
      }
      this.setState({
        roleId: this.selectedValues
      });
    }

    this.setState({
      selected: newSelected,
      selectAll: 2
    });
  };

  toggleSelectAll = () => {
    let newSelected = {};

    if (this.state.selectAll === 0) {
      this.state.data.forEach(x => {
        newSelected[x.roleId] = true;
        this.selectedValues.push(x.roleId);
      });
      this.setState({
        roleId: this.selectedValues
      })
    } else {
      this.selectedValues = [];
      this.setState({
        roleId: []
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
        parentRecords={this.state.data}
        parentColumns={this.columns}
        defaultSorted={[{ id: "roleId", asc: true }]}
        filterable={true}
        minRows={0}
        classes=""
        defaultPageSize={10}
        showPaginationBottom={true}
        showPaginationTop={false}
        classes=""
      />
    )
  }

  responseRoles = () => {
    if (this.props.stateOfUpdateRole.status == 200) {
      this.setState({
        loader: true,
        roleName:"",
        addModeIsEnable: true,
      }, () => this.getData());
    }

    if (this.props.stateOfRoleReducer.status == 200) {
      this.props.create_role_reset();
      this.setState({
        loader: true,
        roleName: "",
        addModeIsEnable: true,
      }, () => this.getData());
    }

    if (this.props.stateOfUpdateRole.status == 400) {
      this.setState({
        loader: true,
      }, () => this.getData());
    }
  }

  columnDynamic = () => {
    this.columns = [
      // TODO
      // {
      //   Header: "Action",
      //   id: "checkbox",
      //   width: 40,
      //   accessor: "",
      //   sortable: false,
      //   filterable: false,
      //   Cell: ({ original }) => {
      //     return (
      //       <div className="text-center">
      //         <input
      //           type="checkbox"
      //           checked={this.state.selected[original.roleId] === true}
      //           onChange={() => this.toggleRow(original.roleId)}
      //         />
      //       </div>
      //     );
      //   },
      //   Header: x => {
      //     return (
      //       <input
      //         type="checkbox"
      //         className="checkbox"
      //         checked={this.state.selectAll === 1}
      //         ref={input => {
      //           if (input) {
      //             input.indeterminate = this.state.selectAll === 2;
      //           }
      //         }}
      //         onChange={() => this.toggleSelectAll()}
      //       />
      //     );
      //   }
      // },
      {
        Header: "Role Name",
        accessor: "roleName"
      }, {
        accessor: "Action",
        id: "Action",
        Header: "Action",
        Cell: this.renderEditable,
        filterable: false
      }
    ];
  }
   
  renderEditable = cellInfo => {
    return (
      <div>
        <span className={this.state.data[cellInfo.index]["isActive"] ? "mr-1 ml-1 ApproveLink": "mr-1 ml-1 ApproveLink invisible"}>
          <i
          style={{ cursor: "pointer" }}
          className="fa fa-pencil-square-o fa-2x"
          onClick={() => {
            this.setState({
              roleName: this.state.data[cellInfo.index]["roleName"],
              roleId: this.state.data[cellInfo.index]["roleId"],
              addModeIsEnable: false
            });
          }} />
          |
        </span> 
        <Switch
          className="pl-1"
          height={20}
          width={42}
          onChange={e => {
            const data = [...this.state.data];
            data[cellInfo.index]["isActive"] = e;
            this.setState({
              data
            }, () => this.props.update_roles({
                authToken:this.state.authToken,
                roleId: this.state.data[cellInfo.index]["roleId"],
                roleName: this.state.data[cellInfo.index]["roleName"],
                userType: this.state.userType,
                isActive: this.state.data[cellInfo.index]["isActive"]
                })
              )
            }
          }
          checked={this.state.data[cellInfo.index]["isActive"]}
        />
      </div>
    );
  }

  render() {
    this.responseRoles();
    return (
      <div>
        {/* <div className="page-title">
          <div className="row">
            <div className="col-sm-6">
              <h6 className="mb-0">Roles List</h6>
            </div>
            <div className="col-sm-6">
              <nav
                className="float-left float-sm-right"
                aria-label="breadcrumb"
              >
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Roles</a>
                  </li>
                  <li className="active breadcrumb-item" aria-current="page">
                    Roles List
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div> */}
        {/* Row Action */}
        <div className="row actionRow">
          <div className="col-sm-12">
            <CreateRole parentState={this.state} />
          </div>
        </div>
        <div className="roles-list">
          <Loader loading={this.state.loader} />
          {
            /* rendering datatable */
            (this.state.data && this.state.data.length > 0)
              ? this.loadExtronTable()
              : noRecordsAvailable("No Records Found.", "")
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    stateOfUser: state.user,
    stateOfRoleReducer: state.roles,
    stateGetRoles: state.getRolesReducer,
    stateOfUpdateRole: state.updateRolesReducer
  };
};

const mapDispatchToProps = {
  get_roles, get_roles_reset,
  create_role_reset,
  update_roles,
  update_roles_reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RolesList);
