import React from "react";
import ReactTable from "react-table";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { connect } from "react-redux";
import { Loader, LoadingOverlay } from "react-overlay-loader";
import BoxScanningComponent from "./BoxScanningComponent";
import { reset_view_scanned_items, update_scanned_items, reset_state_serial } from "../../reduxUtils/actions/workflow/taggedReceiving";
import ExtronTable from "../Elements/ExtronTable";
import { noRecordsAvailable } from "../Elements/NoRecordsAvailable";
import { print_tagged_receiving, reset_print_tagged_receiving } from "../../reduxUtils/actions/printActions";
import { errorList, printDocumentPopUp } from "../../utils/HelperFunctions";
import { ToastContainer, toast } from "react-toastify";

class ViewScannedItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: props.parentState.viewScannedItems,
      authToken: this.props.stateOfUser.authToken,
      actionType: "edit",
      idReceivingDetail: props.parentState.currentIdReceivingDetails,
      viewScanModal: props.parentState.viewScanModal,
      viewScannedPartNumber: props.parentState.viewScannedPartNumber
    }
    this.columns = [

      {
        Header: 'Container ID',
        accessor: 'ContainerId',
        Cell: this.renderEditable,
      },
      {
        Header: 'Serial #',
        accessor: 'SerialNumber',
        Cell: this.renderEditable
      },
      {
        Header: 'Software Version',
        accessor: 'SoftwareVer',
        Cell: this.renderEditable
      }, {
        Header: 'Mac ID',
        accessor: 'MacId',
        Cell: this.renderEditable
      }, {
        Header: 'Temp ID 1',
        accessor: 'tempId1',
        Cell: this.renderEditable
      }, {
        Header: 'Temp ID 2',
        accessor: 'tempId2',
        Cell: this.renderEditable
      }, {
        Header: 'Asset ID',
        accessor: 'AssetId',
        Cell: this.renderEditable
      }];
  }

  componentWillMount() {
    this.props.reset_state_serial();
    this.props.reset_print_tagged_receiving();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.viewScannedItems,
      idReceivingDetail: nextProps.currentIdReceivingDetails,
      viewScanModal: nextProps.viewScanModal,
      viewScannedPartNumber: nextProps.viewScannedPartNumber
    });
  }

  componentWillMount() {
    this.props.reset_state_serial();
    this.props.reset_print_tagged_receiving();
  }

  renderEditable = cellInfo => {
    return (
      <input
        type="text"
        className="form-control"
        onChange={e => {
          const data = [...this.state.data];
          data[cellInfo.index][cellInfo.column.id] = e.target.value;
          this.setState({ data });
        }}
        value={this.state.data[cellInfo.index][cellInfo.column.id]}
        disabled={cellInfo.column.id == 'ContainerId'}
      />
    );
  }

  updateSerialNumbers = () => {
    this.props.update_scanned_items(this.state)
  }

  notifyOnSuccess = (message) => {
    return toast.success(message);
  }

  notifyOnError = (message) => {
    return toast.error(message);
  }

  updateSerialItemsResponse = () => {
    if (this.props.stateOfSerialItems.status == 200) {
      this.props.reset_state_serial();
      this.notifyOnSuccess("Successfully Updated.");
    }

    if (this.props.stateOfSerialItems.status == 400) {
      this.props.reset_state_serial();
      this.notifyOnError("Unable to update. Try Again.");
    }
  }

  loadExtronTable = () => {
    return (
      <ExtronTable
        parentRecords={this.state.data}
        parentColumns={this.columns}
        defaultSorted={[{ id: "ContainerId", desc: true }]}
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

  printTaggedReceiving = () => {
    this.setState({
    }, () => this.props.print_tagged_receiving(this.state));
  }

  render() {
    this.updateSerialItemsResponse();
    return (
      <div>
        <ToastContainer />
        <Modal isOpen={this.state.viewScanModal} toggle={() => this.props.onChildUpdateViewScan(false)} className='serial-popup'>
          <ModalHeader toggle={this.onTogglePopup}>
            View/Update Serial Numbers
          </ModalHeader>
          <ModalBody>
            <div className="form-row">
              <div className="form-group col-md-2">
                <label>Part#</label>
              </div>
              <div className="form-group col-md-4">
                <label>{this.state.viewScannedPartNumber}</label>
              </div>
              <div className="form-group col-md-2">
                <label>Print</label>
              </div>
              <div className="form-group col-md-4">
                <label><i style={{cursor:"pointer"}} className="fa fa-print fa-2x" onClick={() => this.printTaggedReceiving()} aria-hidden="true"></i>
</label>
              </div>
            </div>
            {
              /* rendering datatable */
              (this.state.data && this.state.data.length > 0)
                ? this.loadExtronTable()
                : noRecordsAvailable("No Records Found.", "")
            }
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.props.onChildUpdateViewScan(false)}>Close</Button>
            <Button color="primary" onClick={() => this.updateSerialNumbers()}>Save</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

const mapDispatchToProps = {
  reset_view_scanned_items: reset_view_scanned_items,
  reset_state_serial: reset_state_serial,
  update_scanned_items: update_scanned_items,
  print_tagged_receiving,
  reset_print_tagged_receiving
};

const mapStateToProps = state => {
  return {
    stateOfUser: state.user,
    stateOfSerialItems: state.serial_items,
    stateOfTaggedReceivingPrint: state.tagged_receiving_reducer
  };
};

ViewScannedItems = connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewScannedItems);

export default ViewScannedItems;