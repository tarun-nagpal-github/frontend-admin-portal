import React from "react";
import {
  Card, CardBody, Modal, ModalHeader,
  ModalBody, Button, ModalFooter, Row, Col, Alert
} from "reactstrap";
import swal from "sweetalert";
import { Redirect } from "react-router-dom";
import ReactTable from "react-table";
import CONSTANTS_IMPORT from "../../config/constants.json";
import "./ReceivingAtDockDashboard.scss";
import { connect } from "react-redux";
import { GetReciepts } from "../../services/Receiving";
import { Loader } from "react-overlay-loader";
import { RECEIPT_STATUS } from "./ReceivingHelper";
import {
  edit_reciept,
  edit_reciept_reset,
  delete_reciept,
  delete_reciept_reset,
  fetch_receiving_list,
  reset_action,
  push_receiving_state,
  getReceivingCountAction
} from "../../reduxUtils/actions/receiving";
import SweetAlert from "react-bootstrap-sweetalert";
import { formatDate, ucfirst } from "../../utils/HelperFunctions";
import ReactTooltip from "react-tooltip";
import { logout, reset_login, token_expire } from "../../reduxUtils/actions/auth";
import DeleteReciept from "./DeleteReciept.js";
import ExtronTable from "../Elements/ExtronTable";
import { noRecordsAvailable } from "../Elements/NoRecordsAvailable";
import ShowMultiselectComponent from "../Elements/ShowMultiselectComponent";
import ACTIONS from "../../config/ActionList.json";
import Axios from "axios";
import endpoint from '../../config/endpoints';
import { AxiosErrorHandler } from "../../utils/AxiosErrorHandler";

const API_AUTH_ENDPOINT = endpoint.AUTH_URL;

const DEFAULT_INPUT_TEXT = "";
const CONSTANTS = CONSTANTS_IMPORT.RECEIVING_DASHBOARD;

class ReceivingAtDockDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.selectedRowTemp = [];
    this.deleteFlag = false;
    this.state = {
      modal: false,
      selected: {},
      selectAll: 0,
      redirect: false,
      receiptList: [],
      receiptListStatus: null,
      authToken: this.props.stateOfLogin.authToken,
      idUser: null,
      loader: true,
      idReceiving: null,
      foo: null,
      text: DEFAULT_INPUT_TEXT,
      isDelete: false,
      isRedireaction: false,
      TagNumber: true,
      TrackingNumber: true,
      ClientName: true,
      CarrierName: true,
      PackingSlipNumber: true,
      ReceivedOn: true,
      Discrepancy: true,
      Status: true,
      selectedColumns: [],
      alertClosed: false,
      alertOpen: false
    };
  }

  storeReceiptParams = (receivingId, tag) => {
    this.props.push_receiving_state({ receivingId, tag });
  }

  editRecieptAction(IdReceiving = null) {
    this.setState(
      {
        idReceiving: IdReceiving,
        redirect: true
      },
      () => {
        this.props.edit_reciept(this.state);
      }
    );
  }

  alertToggleOnClose = () => {
    this.setState(prevState => ({
      alertClosed: !prevState.alertClosed
    }));
  }

  alertToggleOnOpen = () => {
    this.setState(prevState => ({
      alertOpen: !prevState.alertOpen
    }));
  }
 
 

  getReceiptList() { 
    let config = {
      headers: {
        "Content-Type": "application/json-patch+json",
        "Authorization": "Bearer " + this.props.stateOfLogin.authToken
      }
    }
    // TODO : Remove the Get Axios Call. Send access token 
    Axios.get(API_AUTH_ENDPOINT + "user/info", config).then((response) => {
      let userId = 0;
      if(Array.isArray(response.data.data) &&  response.data.data.length > 0 ){
        userId = response.data.data[0].userId; 
      }   
      this.setState(
        {idUser : (userId)}, ()=> {
          this.props.fetch_receiving_list(this.state);
        });
    }).catch(error => {
      if(error.response) {
        let response = error.response.status;
        if(response == 401){          
          this.props.token_expire();
        }
      }
    });
  }


  componentWillMount() {
    this.props.getReceivingCountAction({zone:this.props.stateOfZone.zone});
    if (this.props.stateOfLogin.authToken) { 
      this.getReceiptList();
      // this.props.fetch_receiving_list(this.state);
    }
  }

  

  toggleRow = TagNumber => {
    const newSelected = Object.assign({}, this.state.selected);
    newSelected[TagNumber] = !this.state.selected[TagNumber];
    this.setState({
      selected: newSelected,
      selectAll: 2
    });
  };

  toggleSelectAll = () => {
    let newSelected = {};

    if (this.state.selectAll === 0) {
      this.state.receiptList.forEach(x => {
        if (x.Status != RECEIPT_STATUS.CLOSED) {
          newSelected[x.IdReceiving] = true;
        }
      });
    }

    this.setState({
      selected: newSelected,
      selectAll: this.state.selectAll === 0 ? 1 : 0
    });
  };

  redirectToWizard = () => {
    // if (this.props.stateOfReceiving.receivingWorkflowFlag) {
    //   return <Redirect to="/receiving-workflow" />;
    // }
    if (this.state.isRedireaction) {
      return <Redirect to="/receiving-workflow" />;
    }
  };

  hideDeleteAlert = () => {
    this.setState({
      isDelete: false
    });
  };

  rowFormat = (cell, row) => {
    switch (row.Status) {
      case "closed":
        return (
          <div>
            <Alert color="danger" className="text-center">
              {row.Status}
            </Alert>
          </div>
        );
        break;
      case "open":
        return (
          <div>
            <Alert color="success" className="text-center">
              {row.Status}
            </Alert>
          </div>
        );
        break;
    }
  };

  setRedirect = () => {
    this.setState({
      redirect: true
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/receiving-at-dock" />;
    }
  };

  showDeleteAlert = () => {
    if (Object.keys(this.state.selected).length > 0) {
      this.setState(
        {
          isDelete: true
        }
      );
    } else {
      swal(CONSTANTS.EMPTY_MSG_DELETE);
    }
  };

  resetMessage = (resetPin = null) => {
    this.props.delete_reciept_reset();
    this.setState({
      pin: 0
    });

    if (resetPin) {
      this.hideDeleteAlert();
      this.getReceiptList();
    }
  };

  deleteSuccess = () => {
    if (this.props.stateDeleteReciept.status == 400) {
      return (
        <div>
          <SweetAlert
            error
            title={this.props.stateDeleteReciept.message}
            onConfirm={this.resetMessage}
          >
            {this.props.stateDeleteReciept.message}!
          </SweetAlert>
        </div>
      );
    }

    if (this.props.stateDeleteReciept.status == 200) {
      return (
        <div>
          <SweetAlert
            success
            title={this.props.stateDeleteReciept.message}
            onConfirm={() => this.resetMessage(true)}
          >
            {this.props.stateDeleteReciept.message}!
          </SweetAlert>
        </div>
      );
    }
  };

  receiving_list = () => {
    if (this.props.stateOfReceivingList.status == 200) {
      this.setState({
        receiptList: this.props.stateOfReceivingList.data,
        loader: false
      });
      this.props.reset_action();
    }

    if (this.props.stateOfLogin.tokenExpired) {
      return <Redirect to="/login" />;
      // if (this.props.stateOfLogin.authToken) {
      // this.props.logout(this.props.stateOfLogin.authToken);
      // this.props.resetLogin(true);
      // }
    }
  };

  changeHandler = () => {
    this.setState({
      isDelete: false
    });
  }

  loadExtronTable = () => {
    return (
      <ExtronTable
        parentRecords={this.state.receiptList}
        parentColumns={this.columns}
        defaultSorted={[{ id: "ReceivedOn", desc: true }]}
        filterable={true}
        minRows={0}
        defaultPageSize={10}
        showPaginationBottom={true}
        showPaginationTop={false}
        classes="-striped -highlight"
        previousText="<<"
        nextText=">>"
      />
    )
  }

  columnList = () => {
    this.columns = [{
      id: "checkbox",
      accessor: "",
      width: 40,
      sortable: false,
      filterable: false,
      Cell: ({ original }) => {
        if (original.Status == RECEIPT_STATUS.OPEN) {
          return (
            <div className="text-center">
              <input
                type="checkbox"
                checked={this.state.selected[original.IdReceiving] === true}
                onChange={() => this.toggleRow(original.IdReceiving)}
              />
            </div>
          );
        } else {
          return (
            <div className="text-center">
              <input
                type="checkbox"
                disabled={true}
              />
            </div>
          );
        }
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
      Header: "Tag #",
      id: "TagNumber",
      show: this.state.TagNumber,
      accessor: d => d.TagNumber
    },
    {
      Header: "Tracking",
      id: "TrackingNumber",
      show: this.state.TrackingNumber,
      accessor: d => d.TrackingNumber
    },
    {
      Header: "Client",
      id: "ClientName",
      show: this.state.ClientName,
      accessor: d => ucfirst(d.ClientName),
      width: 60
    },
    {
      Header: "Carrier",
      id: "CarrierName",
      show: this.state.CarrierName,
      accessor: d => d.CarrierName,
      width: 80
    },
    {
      Header: "Packing Slip",
      id: "PackingSlipNumber",
      show: this.state.PackingSlipNumber,
      accessor: d => d.PackingSlipNumber
    }, {
      Header: "Received on",
      id: "ReceivedOn",
      show: this.state.ReceivedOn,
      accessor: d => {
        return formatDate(d.ReceivedOn);
      }
    },
    {
      Header: "Discrepancy",
      id: "Discrepancy",
      show: this.state.Discrepancy,
      accessor: d => d.Discrepancy,
      Cell: ({ original }) => {
        return (
          <div>
            <p className="text-truncate" data-tip data-for={original.IdReceiving.toString()}>
              {original.Discrepancy}
            </p>
            <ReactTooltip
              id={original.IdReceiving.toString()}
              type="dark"
              effect="solid"
            >
              <p className="tooltip-ts">
                {original.Discrepancy}
              </p>
            </ReactTooltip>
          </div>
        );
      }
    },
    {
      Header: "Status",
      id: "Status",
      accessor: d => d.Status,
      show: this.state.Status,
      width: 220,
      filterable: true,
      // Filter: ({ filter, onChange }) => (
      //   <input type="text" disabled />
      // ),
      Cell: ({ original }) => {
        switch (original.Status) {
          case "Closed":
            return (
              <div>
                <div style={{ cursor: "pointer" }}>
                  {/* <span className="font-bold text-danger" onClick={() => this.editRecieptAction(original.IdReceiving)}>{original.Status}</span> | <span className="font-bold text-primary" onClick={() => this.storeReceiptParams(original.IdReceiving, original.TagNumber)}>{CONSTANTS.MOVE_TO_M2M}</span> */}
                    {(this.isActionAllowed(ACTIONS.RECIEVING.DASHBOARD.CLOSED_RECEIPT_DETAIL)) && 
                     <span className="font-bold text-danger" onClick={() => this.editRecieptAction(original.IdReceiving)}>{original.Status} &nbsp; <i style={{color: "black"}}>|</i>  </span> 
                    }
                  {(this.isActionAllowed(ACTIONS.RECIEVING.DASHBOARD.MOVE_TO_M2M)) && 
                      <span className="font-bold text-primary" onClick={() => this.setState({ isRedireaction: true })}>{CONSTANTS.MOVE_TO_M2M}</span> 
                    }
                </div>
              </div>
            );
          case "Open":
            let value = null;
            if((this.isActionAllowed(ACTIONS.RECIEVING.DASHBOARD.EDIT_RECIEVING))){ 
              value = <div onClick={() => this.editRecieptAction(original.IdReceiving)}>
                <div style={{ cursor: "pointer" }}>
                  <span className="font-bold text-success">{original.Status}</span>
                </div>
              </div>;
            }
            return value;
        }
      }
    }];
  }

  componentDidMount() {
    var selectedColumns = [];
    this.columns.map((column, i) => {
      if (column.id != "checkbox") {
        selectedColumns.push(column.id);
      }
    });

    this.setState({
      selectedColumns
    });
  }

  stateUpdate = (getState) => {
    for (var i = 0; i < this.state.selectedColumns.length; i++) {
      if (getState.includes(this.state.selectedColumns[i])) {
        this.setState({
          [this.state.selectedColumns[i]]: true
        });
      } else {
        this.setState({
          [this.state.selectedColumns[i]]: false
        });
      }
    }
  }

  getSelectedColumn = (columns) => {
    let selectedColumns = [];

    columns.map((column, i) => {
      if (column.id != "checkbox") {
        selectedColumns.push(column.id);
      }
    });

    return selectedColumns;
  }

  isActionAllowed = (actionName = "") => {    
    let allowed = false;     
    if(Array.isArray(this.props.actions) && this.props.actions.length > 0){
      allowed = this.props.actions.find((element) =>  element == actionName);       
    }
    return allowed;
  }
    
  render() {
    this.receiving_list();
    this.columnList(); 
    return (
      <div className="mb-90" >
        {this.redirectToWizard()}
        {this.deleteSuccess()}
        <div className="page-title">
          <div className="row">
            <div className="col-sm-6">
              <h6 className="mb-0">{CONSTANTS.PAGE}</h6>
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
                    Receiving Dashboard
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        <DeleteReciept
          isDelete={this.state.isDelete}
          authToken={this.state.authToken}
          selected={this.state.selected}
          onChange={this.changeHandler}
        />

        <Card className="card-statistics">
          {this.renderRedirect()}
          <CardBody>
            <div className="row">
              <div className="col-md-2">
                {(this.state.receiptList.length > 0) && <ShowMultiselectComponent
                  columns={this.columns}
                  onUpdateState={this.stateUpdate}
                  selectedColumns={this.getSelectedColumn(this.columns)}
                />} 
              </div>
              <div className="col-md-10 mt-2 mb-2"> 
                {(this.isActionAllowed(ACTIONS.RECIEVING.DASHBOARD.DELETE_RECIEVING)) && (this.state.receiptList.length > 0) && <input
                  type="button"
                  className="btn btn-danger float-right"
                  onClick={this.showDeleteAlert}
                  value={CONSTANTS.DELETE_RECEIPT_BTN}
                />}
               {(this.isActionAllowed(ACTIONS.RECIEVING.DASHBOARD.ADD_RECIEVING)) && <input
                  type="button"
                  className="btn btn-primary float-right mr-2"
                  value={CONSTANTS.ADD_RECEIPT_BTN}
                  onClick={this.setRedirect}
                />}
              </div>
            </div>
            <div className="form-group reciept-list mb-5">
              <Loader loading={this.state.loader} />
              {
                /* rendering datatable */
                (this.state.receiptList.length > 0)
                  ? this.loadExtronTable()
                  : noRecordsAvailable("No Receipt Found..", "")
              }
            </div>
          </CardBody>
        </Card>
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    stateOfLogin: state.user,
    stateReciept: state.edit_receiving,
    stateDeleteReciept: state.delete_reciept,
    stateOfReceivingList: state.receiving_list,
    stateOfReceiving: state.receiving_state,
    userMeta: state.user_meta,
    stateOfZone: state.storeZoneReducer,
    permittedPages: state.getPermittedPagesReducer.permittedPages,
  };
};

const mapDispatchToProps = {
  push_receiving_state: push_receiving_state,
  reset_action: reset_action,
  edit_reciept: edit_reciept,
  edit_reciept_reset: edit_reciept_reset,
  delete_reciept: delete_reciept,
  delete_reciept_reset: delete_reciept_reset,
  fetch_receiving_list: fetch_receiving_list,
  logout: logout,
  resetLogin: reset_login,
  getReceivingCountAction,
  token_expire
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceivingAtDockDashboard);

