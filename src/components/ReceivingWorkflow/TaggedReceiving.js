import React from "react";
import ReactTable from "react-table";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { fetch_graphql_response, reset_action } from "../../reduxUtils/actions/graphql";
import { connect } from "react-redux";
import { Loader, LoadingOverlay } from "react-overlay-loader";
import BoxScanningComponent from "./BoxScanningComponent";
import { ucfirst, formatDate } from "../../utils/HelperFunctions";
import ViewScannedItems from "./ViewScannedItems";
import SimpleReactValidator from "simple-react-validator";
import { view_scanned_items, reset_view_scanned_items, scanned_per_boxes_action, scanned_per_box_reset, reset_state_serial } from "../../reduxUtils/actions/workflow/taggedReceiving";
import ExtronTable from "../Elements/ExtronTable";
import { noRecordsAvailable } from "../Elements/NoRecordsAvailable";
import ViewUploadedFiles from "../../utils/ViewUploadedFiles";
import ACTIONS from "../../config/ActionList.json";
import { getReceivingCountAction } from "../../reduxUtils/actions/receiving";

class TaggedReceiving extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      modal1: false,
      modal2: false,
      selected: {},
      selectAll: 0,
      selectedData: [],
      loader: false,
      metaRequest: {
        "id": 0,
        "listType": "TAG",
        "startRowIndex": 0,
        "pageSize": 100,
        "orderByName": "IdReceiving",
        "orderByType": "ASC"
      },
      authToken: this.props.stateOfAction.authToken,
      openedPN: null,
      itemsPerBoxes: null,
      showScanSection: false,
      viewScanModal: false,
      viewScannedItems: [],
      quantityLeft: null,
      totalContainers: null,
      quantityReceived: null,
      serialNumberOfItemsPerBox: null,
      currentBox: 1,
      currentIdReceivingDetails: "",
      viewScannedPartNumber: "",
      alertErrorViewScanned: true,
      alertErrorScannedPBox: true,
      numberOfBoxesPerPallet: null
    };

    this.validator = new SimpleReactValidator({
      validators: {
        required: {
          message: ":field is required",
          rule: (val, params, validator) => {
            return val != "";
          },
          messageReplace: (message, params) => message.replace(':field', this.validator.helpers.toSentence(params)),
          required: true
        }
      }
    });

    this.columns = [{
      Header: 'Tag #',
      accessor: 'tagNumber',
    }, {
      Header: 'Tracking #',
      accessor: 'trackingNumber'
    }, {
      Header: 'Client',
      id: 'clientName',
      accessor: d => ucfirst(d.clientName)
    }, {
      Header: 'Carrier',
      accessor: 'carrierName'
    }, {
      Header: 'Packing Slip',
      accessor: 'packingSlipNumber'
    },
    {
      Header: 'Papers',
      accessor: 'papersCount',
      Cell: ({ original }) => {
        return <ViewUploadedFiles attachments={original.attachments.supportingDocuments} />;
      },
      Filter: ({ filter, onChange }) => (
        <input type="text" disabled className="datatable-input-width" />
      ),
    },
    {
      Header: 'Pictures',
      accessor: 'picturesCount',
      Cell: ({ original }) => {
        return <ViewUploadedFiles attachments={original.attachments.pictures} />;
      },
      Filter: ({ filter, onChange }) => (
        <input type="text" disabled className="datatable-input-width" />
      ),
    },
    {
      Header: 'Received on',
      accessor: 'receivedOn',
      Cell: ({ original }) => {
        return formatDate(original.receivedOn)
      }
    }];

    this.subcolumns = [
      {
        Header: 'Qty Received',
        id: 'qtyReceived',
        Cell: ({ original }) => {
          return original.qtyReceived
        },
        headerClassName: 'thead-custom',
      }, {
        Header: 'Incoming P/N',
        id: 'partNumber',
        Cell: ({ original }) => {
          return original.partNumber
        },
        headerClassName: 'thead-custom',
      }, {
        Header: 'Incoming Rev#',
        id: 'revisionNumber',
        Cell: ({ original }) => {
          return original.revisionNumber
        },
        headerClassName: 'thead-custom',
      }, {
        Header: 'New P/N',
        id: 'mappedPartNumber',
        Cell: ({ original }) => {
          return original.mappedPartNumber
        },
        headerClassName: 'thead-custom',
      }, {
        Header: 'New Rev #',
        id: 'mappedRevisionNumber',
        Cell: ({ original }) => {
          return original.mappedRevisionNumber
        },
        headerClassName: 'thead-custom',
      }, {
        Header: 'Boxes',
        id: 'box',
        Cell: ({ original }) => {
          return original.box
        },
        headerClassName: 'thead-custom',
      }, {
        Header: 'Pallets',
        id: 'pallet',
        Cell: ({ original }) => {
          return original.pallet
        },
        headerClassName: 'thead-custom',
      }, {
        Header: 'Lot #',
        id: 'lotNumber',
        Cell: ({ original }) => {
          return original.lotNumber
        },
        headerClassName: 'thead-custom',
      }, {
        Header: 'Action',
        accessor: 'Action',
        width: 200,
        filterable: false,
        headerClassName: 'thead-custom',
        Cell: ({ original }) => {
          return (
            <div>
              {(this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.TAGGED_RECIEVING.SAVE_SERIAL_NUMBER) && original.scanLeft != 0) ?
                  <span
                  onClick={() => (original.scanSerialNumber == 0) ? this.scanItemsPerBoxPopup(original) : this.checkIfScannedPerBoxStored(original)}
                  className="cursor-pointer"> Collect </span> : <span>Completed </span>
                }
              | { this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.TAGGED_RECIEVING.VIEW_SCANNED_SERIAL_NUMBER) && 
              <span className="cursor-pointer" onClick={() => this.viewScansPop(original.idReceivingDetail, 2, original.partNumber)}>View Scans</span>
              }
            </div>
          );
        },
      }
    ];
  }

  getCurrentBoxId = (data = null) => {
    let quantityLeft = data.scanLeft;
    let quantityReceived = data.qtyReceived + 1;
    let serialNumberOfItemsPerBox = data.scanSerialNumber == 0 ? 1 : data.scanSerialNumber;
    let currentBoxId = Math.ceil((quantityReceived - quantityLeft) / serialNumberOfItemsPerBox);
    currentBoxId = (currentBoxId > 0) ? currentBoxId : 1;
    return currentBoxId;
  }

  isActionAllowed = (actionName = "") => {
    return (this.props.actions.indexOf(actionName) >= 0) ? true : false;
  }
  
  checkIfScannedPerBoxStored = (data) => {
    var totalContainers = data.scanLeft / data.scanSerialNumber;
    this.setState({
      openedPN: data.parentRow,
      totalContainers: totalContainers,
      showScanSection: true,
      parts: data,
      currentBox: this.getCurrentBoxId(data),
      totalQuantity: data.qtyReceived / data.scanSerialNumber
    });
  }

  viewScansPop = (idReceivingDetails, ContainerId, partNumber) => {
    this.props.reset_state_serial();
    this.setState({
      currentIdReceivingDetails: idReceivingDetails,
      viewScannedPartNumber: partNumber
    });
    this.props.view_scanned_items({ "idReceivingDetails": idReceivingDetails, "ContainerId": ContainerId, "authToken": this.state.authToken })
  }

  scanItemsPerBoxPopup = data => {
    this.setState({
      openedPN: data.parentRow,
      parts: data,
    }, () => this.toggle());
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  componentWillMount() {
    this.setState({
      loader: true
    });
    this.props.fetch_graphql_response(this.state);
    this.props.reset_view_scanned_items();
    this.props.scanned_per_box_reset();
  }

  togglenested = () => {
    this.setState(prevState => ({
      modal1: !prevState.modal1
    }));
  }

  scannedBoxHandler = (e) => {
    this.setState({
      itemsPerBoxes: e.target.value
    })
  }

  scannedPalletHandler = (e) => {
    this.setState({
      numberOfBoxesPerPallet: e.target.value
    })
  }

  recievingReceiptsResponse = () => {
    if (this.props.stateOfReceipts.status == 200) {
      this.props.getReceivingCountAction({zone:this.props.stateOfZone.zone});
      this.setState({
        data: this.props.stateOfReceipts.data,
        pgSize: this.props.stateOfReceipts.data.length,
        loader: false
      }, () => this.props.reset_action());
    }
  }

  actionPerCheck = () => {
    if (this.validator.allValid()) {
      this.props.scanned_per_boxes_action({ "idReceivingDetails": this.state.parts.idReceivingDetail, "serialNumberOfItemsPerBox": this.state.itemsPerBoxes, "authToken": this.state.authToken, "numberOfBoxesPerPallet": this.state.numberOfBoxesPerPallet });
      var totalContainers = this.state.openedPN.scanLeft / this.state.itemsPerBoxes;
      this.setState({
        totalContainers: Math.round(totalContainers)
      })
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  updateStateViewScan = (incomingState) => {
    if (incomingState) {
      this.setState({
        viewScanModal: true
      });
    } else {
      this.setState({
        viewScanModal: false
      });
    }
  }

  updateStateAddItemScan = (incomingState) => {
    if (incomingState) {
      this.setState({
        showScanSection: true
      });
    } else {
      this.props.fetch_graphql_response(this.state);
      this.setState({
        showScanSection: false
      });
    }
  }

  viewScannedItemResponse = () => {
    if (this.props.stateOfViewScannedItems.status == 200) {
      this.props.reset_view_scanned_items();
      this.setState(prevState => ({
        viewScanModal: !prevState.viewScanModal,
        viewScannedItems: this.props.stateOfViewScannedItems.data
      }));
    }
  }

  alertErrorViewScannedFn = () => {
    this.setState(prevState => ({
      alertErrorViewScanned: !prevState.alertErrorViewScanned
    }));
  }

  viewScannedItemsErrorLog = () => {
    if (this.props.stateOfViewScannedItems.status == 400) {
      var errorLogs = this.props.stateOfViewScannedItems.errors;
      var items = [];
      errorLogs.forEach((err, i) => {
        items.push(<li className="ml-2" key={i}>{err}</li>);
      });
      return (
        <div>
          <Alert color="danger">
            {items}
          </Alert>
        </div>
      );
    }
  }

  alertErrorScannedPBoxFn = () => {
    this.setState(prevState => ({
      alertErrorScannedPBox: !prevState.alertErrorScannedPBox
    }));
  }

  scannedPerBoxErrorLog = () => {
    if (this.props.stateOfScannedPerBox.status == 400) {
      var errorLogs = this.props.stateOfScannedPerBox.errors;
      var items = [];
      errorLogs.forEach((err, i) => {
        items.push(<li className="ml-2" key={i}>{err}</li>);
      });
      // this.closeAlertBox();
      return (
        <div>
          <Alert color="danger">
            {items}
          </Alert>
        </div>
      );
    }
  }

  // Todo: will be implementing below code later
  // closeAlertBox = () => {
  //   setTimeout(() => {
  //     this.props.scanned_per_box_reset();
  //     this.alertErrorScannedPBoxFn();
  //   }, 3000);
  // }

  scannedPerBoxResponse = () => {
    if (this.props.stateOfScannedPerBox.status == 200) {
      var totalQuantity = this.state.parts.qtyReceived / this.state.itemsPerBoxes;
      this.props.scanned_per_box_reset();
      this.setState({
        showScanSection: true,
        currentBox: this.getCurrentBoxId(this.state.parts),
        totalQuantity
      });
      this.toggle();
    }
  }

  updateIncomingQuantity = () => {

    if (this.props.stateOfSerialItems.status == 200) {

      let quantityLeft = this.props.stateOfSerialItems.data.quantityLeft;
      let quantityReceived = this.props.stateOfSerialItems.data.quantityReceived;
      let serialNumberOfItemsPerBox = this.props.stateOfSerialItems.data.serialNumberOfItemsPerBox;
      // let containerRunningId = ((quantityReceived - quantityLeft) / serialNumberOfItemsPerBox) + 1;
      let data = { scanLeft: quantityLeft, qtyReceived: quantityReceived, scanSerialNumber: serialNumberOfItemsPerBox };

      this.setState({
        quantityLeft,
        serialNumberOfItemsPerBox,
        quantityReceived,
        currentBox: this.getCurrentBoxId(data)
      })
    }
  }

  loadExtronTable = () => {
    return (
      <ExtronTable
        parentRecords={this.state.data}
        parentColumns={this.columns}
        defaultSorted={[{ id: "tagNumber", desc: true }]}
        filterable={true}
        minRows={0}
        defaultPageSize={10}
        showPaginationBottom={true}
        showPaginationTop={false}
        childRecords={"parts"}
        childColumns={this.subcolumns}
        defaultSorted={{ id: "receivedOn", desc: true }}
        childPaginationSecondary={true}
        classes="-striped -highlight"
      />
    )
  }

  render() {
    this.recievingReceiptsResponse();
    this.viewScannedItemResponse();
    this.scannedPerBoxResponse();
    this.updateIncomingQuantity();
    return (
      <div>
        <Loader fullpage loading={this.state.loader} />
        {this.viewScannedItemsErrorLog()}
        {
          /* rendering datatable */
          (this.state.data && this.state.data.length > 0)
            ? this.loadExtronTable()
            : noRecordsAvailable("No Records Found.", "")
        }
        <Modal isOpen={this.state.modal} toggle={this.toggle} className='tagged-popup'>
          <ModalHeader toggle={this.toggle}>Receive Now</ModalHeader>
          <ModalBody>
            {this.scannedPerBoxErrorLog()}
            <form action="">
              <div className="form-row px-2">
                <div className="form-group col-md-5">
                  <label># of Serial No. to be scanned per box</label>
                </div>
                <div className="form-group col-md-6">
                  <input type="text" className="form-control" id="itemsPerBoxes" name="itemsPerBoxes" onChange={this.scannedBoxHandler} value={this.state.itemsPerBoxes} />
                  <div className="error mt-1">
                    {this.validator.message(
                      "itemsPerBoxes",
                      this.state.itemsPerBoxes,
                      "required:Scanned per box|integer"
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row px-2">
                <div className="form-group col-md-5">
                  <label># Boxes to be scanned per pallet</label>
                </div>
                <div className="form-group col-md-6">
                  <input type="text" className="form-control" id="numberOfBoxesPerPallet" name="numberOfBoxesPerPallet" onChange={this.scannedPalletHandler} value={this.state.numberOfBoxesPerPallet} />
                  <div className="error mt-1">
                    {this.validator.message(
                      "Pallets",
                      this.state.numberOfBoxesPerPallet,
                      "required:Boxes per pallet|integer"
                    )}
                  </div>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            <Button color="primary" onClick={() => this.actionPerCheck()}>OK</Button>
          </ModalFooter>
        </Modal>
        {
          (this.state.showScanSection) ?
            <BoxScanningComponent
              parentState={this.state}
              onChildUpdateScanItemView={this.updateStateAddItemScan}
            /> : <div></div>}

        {
          (this.state.viewScanModal) ?
            <ViewScannedItems
              parentState={this.state}
              onChildUpdateViewScan={this.updateStateViewScan} />
            : <div></div>
        }
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetch_graphql_response: fetch_graphql_response,
  reset_action: reset_action,
  reset_view_scanned_items: reset_view_scanned_items,
  view_scanned_items: view_scanned_items,
  scanned_per_box_reset: scanned_per_box_reset,
  scanned_per_boxes_action: scanned_per_boxes_action,
  reset_state_serial,
  getReceivingCountAction
};

const mapStateToProps = state => {
  return {
    stateOfAction: state.user,
    stateOfReceipts: state.graphql_list,
    stateOfViewScannedItems: state.view_scanned_items_response,
    stateOfScannedPerBox: state.box_scanning_per_box,
    stateOfSerialItems: state.serial_items,
    stateOfZone: state.storeZoneReducer
  };
};

TaggedReceiving = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaggedReceiving);

export default TaggedReceiving;
