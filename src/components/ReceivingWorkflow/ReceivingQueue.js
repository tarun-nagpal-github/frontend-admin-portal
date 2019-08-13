import React from "react";
import ReactTable from "react-table";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { fetch_graphql_response, reset_action } from "../../reduxUtils/actions/graphql";
import { connect } from "react-redux";
import { Loader, LoadingOverlay } from "react-overlay-loader";
import { ucfirst, formatDate } from "../../utils/HelperFunctions";
import ExtronTable from "../Elements/ExtronTable";
import { noRecordsAvailable } from "../Elements/NoRecordsAvailable";
import ViewUploadedFiles from "../../utils/ViewUploadedFiles";
import ACTIONS from "../../config/ActionList.json";
import { getReceivingCountAction } from "../../reduxUtils/actions/receiving";
import { receiving_queue_m2m, reset_receiving_queue_m2m } from "../../reduxUtils/actions/workflow/receivingQueue";
import { ToastContainer, toast } from "react-toastify";
import CONSTANTS from "../../config/constants.json";

// TODO: Need to take validations outside
class ReceivingQueue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      selected: {},
      selectAll: 0,
      selectedData: [],
      modalselected: {},
      modalselectAll: 0,
      modalselectedData: [],
      data: [],
      modaldata: [{
        id: '4',
        SO: '0000234213',
        CTRL: '289381',
        CustomerName: 'Mark',
        QuantityReqd: '2',
        QOH: '4',
        Quantity: '',
      }, {
        id: '5',
        SO: '0000234213',
        CTRL: '289381',
        CustomerName: 'Mark',
        QuantityReqd: '2',
        QOH: '4',
        Quantity: '',
      }],
      metaRequest: {
        "id": 0,
        "listType": "QUEUE",
        "startRowIndex": 0,
        "pageSize": 100,
        "orderByName": "IdReceiving",
        "orderByType": "ASC",
      },
      alertError: false,
      isRowSelected: true,
      authToken: this.props.stateOfUser.authToken
    };
    this.columns = [
      {
        Header: '',
        accessor: '',
        filterable: false,
        sortable: false,
        Cell: ({ original }) => {
          return (
            <input
              type="checkbox"
              className="checkbox"
              checked={this.state.selected[original.idReceiving] === true}
              onChange={() => this.toggleCheck(original)}
            />
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
        Header: 'Tag #',
        accessor: 'tagNumber'
      }, {
        Header: 'Track #',
        accessor: 'trackingNumber'
      }, {
        Header: 'Client',
        accessor: 'clientName'
      }, {
        Header: 'Carrier',
        accessor: 'carrierName'
      }, {
        Header: 'Packing Slip',
        accessor: 'packingSlipNumber'
      },
      {
        Header: 'Received on',
        accessor: 'receivedOn',
        Cell: ({ original }) => {
          return formatDate(original.receivedOn)
        }
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
        Header: 'Allocate',
        accessor: 'Allocate',
        Filter: ({ filter, onChange }) => (
          <input type="text" disabled className="datatable-input-width" />
        ),
        Cell: ({ original }) => {
          let value = this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.RECIEVING_QUEUE.ALLOCATE_TO_SALES_ORDER);
          if (value) {
            return (
              <button className="btn btn-styling btn-sm" value={this.state.receivingId} onClick={() => this.toggle(original.idReceiving, original.packingSlipNumber)}>
                Allocate
            </button>
            );
          }
          return null;
        },
      }];

    this.subcolumns = [
      {
        Header: 'Part #',
        accessor: 'partNumber',
        headerClassName: 'thead-custom',
      }, {
        Header: 'Rev #',
        accessor: 'revisionNumber',
        headerClassName: 'thead-custom',
      }, {
        Header: 'Qty Received',
        accessor: 'qtyReceived',
        headerClassName: 'thead-custom',
      }, {
        Header: 'Boxes',
        accessor: 'box',
        filterable: false,
        headerClassName: 'thead-custom',
      }, {
        Header: 'Pallets',
        accessor: 'pallet',
        filterable: false,
        headerClassName: 'thead-custom',
      }, {
        Header: 'Lot #',
        accessor: 'lotNumber',
        headerClassName: 'thead-custom',
      }
    ];
  }


  loadExtronTable = (data, columns, subcolumns = null) => {
    return (
      <ExtronTable
        parentRecords={data}
        parentColumns={columns}
        defaultSorted={[{ id: "tagNumber", desc: true }]}
        filterable={true}
        minRows={0}
        defaultPageSize={10}
        showPaginationBottom={true}
        showPaginationTop={false}
        childRecords={"parts"}
        childColumns={subcolumns}
        childPaginationSecondary={true}
        classes="-striped -highlight"
      />
    )
  }

  isActionAllowed = (actionName = "") => {
    return (this.props.actions.indexOf(actionName) >= 0) ? true : false;
  }

  componentWillMount() {
    this.setState({
      loader: true
    });
    this.props.fetch_graphql_response(this.state);
  }


  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  toggleCheck(data) {
    var selectedData = [];
    const newSelected = Object.assign({}, this.state.selected);
    newSelected[data.idReceiving] = !this.state.selected[data.idReceiving];
    selectedData[data.idReceiving] = data;
    if (newSelected[data.idReceiving] == true) {
      this.setState({
        selectedData: selectedData,
        selected: newSelected,
        selectAll: 2,
        isRowSelected: false
      });
    } else {
      var keys = Object.keys(newSelected)
      var filtered = keys.filter(function (key) {
        return newSelected[key]
      });
      this.setState({
        selectedData: selectedData.filter(record => record.idReceiving != data.idReceiving),
        selected: newSelected,
        selectAll: 0,
        isRowSelected: filtered.length > 0 ? false : true
      });
    }
  }
  modaltoggleCheck(modaldata) {
    var modalselectedData = [];
    const newSelected = Object.assign({}, this.state.modalselected);
    newSelected[modaldata.id] = !this.state.modalselected[modaldata.id];
    if (newSelected[modaldata.id] == true) {
      modalselectedData[modaldata.id] = modaldata;
      this.setState({
        modalselectedData: modalselectedData,
        modalselected: newSelected,
        modalselectAll: 2
      });
    } else {
      this.setState({
        modalselectedData: modalselectedData.filter(record => record.id != modaldata.id),
        modalselected: newSelected,
        modalselectAll: 0
      });
    }
  }
  toggleSelectAll() {
    let newSelected = {};
    if (this.state.selectAll === 0) {
      this.state.data.forEach(x => {
        newSelected[x.idReceiving] = true;
      });
    }
    this.setState({
      selected: newSelected,
      selectAll: this.state.selectAll === 0 ? 1 : 0,
      isRowSelected: this.state.selectAll === 0 ? false : true
    });
  }

  modaltoggleSelectAll() {
    let newSelected = {};
    if (this.state.modalselectAll === 0) {
      this.state.modaldata.forEach(x => {
        newSelected[x.id] = true;
      });
    }
    this.setState({
      modalselected: newSelected,
      modalselectAll: this.state.modalselectAll === 0 ? 1 : 0
    });
  }

  receivingReceiptsResponse = () => {
    if (this.props.stateOfReceipts.status == 200) {
      this.props.getReceivingCountAction({ zone: this.props.stateOfZone.zone });
      this.setState({
        data: this.props.stateOfReceipts.data,
        pgSize: this.props.stateOfReceipts.data.length,
        loader: false
      }, () => this.props.reset_action());
    } else if (this.props.stateOfReceipts.status == 400) {
      this.setState({
        data: this.props.stateOfReceipts.data.errors,
        loader: false
      }, () => this.props.reset_action());
    }
  }

  alertErrorFn = () => {
    this.setState(prevState => ({
      alertError: !prevState.alertError
    }));
  }

  scrollToTopFunc = () => window.scrollTo(0, 0);

  errorLogs = () => {
    if (Array.isArray(this.state.errorLogs) && this.state.errorLogs.length > 0) {
      var items = [];
      let errorLogs = this.state.errorLogs;
      errorLogs.forEach((err, i) => {
        let message = (err.message) ? err.message : err;
        items.push(<li className="ml-2" key={i}>{message}</li>);
      });
      this.scrollToTopFunc();
      return (
        <div>
          <Alert color="danger">
            {items}
          </Alert>
        </div>
      );
    }
  };

  receivingsInM2M = () => {
    var data = this.state.selected;
    var keys = Object.keys(data)
    var filtered = keys.filter(function (key) {
      return data[key]
    });

    if (filtered && filtered.length > 0) {
      this.props.receiving_queue_m2m({ receivingId: filtered , authToken: this.state.authToken})
    }
  }

  receivingInQueueM2MResponse = () => {
    if (this.props.stateOfReceivingQueueInM2M.status == 200) {
      this.props.reset_receiving_queue_m2m();
      this.setState({
        selected: []
      }, () => {
        toast.success(CONSTANTS.RECEIVING_MASTER.RECEIVING_QUEUE_M2M_SUCCESS);
      });
    }

    if(this.props.stateOfReceivingQueueInM2M.status == 400){
      toast.error(CONSTANTS.RECEIVING_MASTER.RECEIVING_QUEUE_M2M_ERROR);
    }
  }

  render() {
    this.receivingInQueueM2MResponse();
    this.receivingReceiptsResponse();
    { this.errorLogs() }
    const modalcolumns = [{
      Header: '',
      accessor: '',
      filterable: false,
      Cell: ({ original }) => {
        return (
          <input
            type="checkbox"
            className="checkbox"
            checked={this.state.modalselected[original.id] === true}
            onChange={() => this.modaltoggleCheck(original)}
          />
        );
      },
      Header: x => {
        return (
          <input
            type="checkbox"
            className="checkbox"
            checked={this.state.modalselectAll === 1}
            ref={input => {
              if (input) {
                input.indeterminate = this.state.modalselectAll === 2;
              }
            }}
            onChange={() => this.modaltoggleSelectAll()}
          />
        );
      }
    }, {
      Header: 'SO #',
      accessor: 'SO',
    }, {
      Header: 'CTRL #',
      accessor: 'CTRL'
    }, {
      Header: 'Customer Name',
      accessor: 'CustomerName'
    }, {
      Header: 'Qty Reqd',
      accessor: 'QuantityReqd'
    }, {
      Header: 'QOH',
      accessor: 'QOH'
    }, {
      Header: 'Qty',
      accessor: 'Quantity',
      filterable: false,
      Cell: ({ original }) => {
        return (
          <input
            type="number"
            min="0"
            className="quantity px-2 form-control"
          />
        );
      },
    }];

    return (
      <div>
        <ToastContainer />
        <Loader fullpage loading={this.state.loader} />
        {
          /* rendering datatable */
          (this.state.data && this.state.data.length > 0)
            ? this.loadExtronTable(this.state.data, this.columns, this.subcolumns)
            : noRecordsAvailable("No Records Found.", "")
        }
        {
          (this.state.data && this.state.data.length > 0) ?
            <div className="moveWarehouse" style={{ paddingBottom: 38 }} >
              {this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.MISSING_PART.RESOLVE_DISCREPANCY) &&
                <button
                  type="button"
                  className="btn btn-primary float-right mt-3"
                  onClick={() => this.receivingsInM2M()}
                  disabled={this.state.isRowSelected}
                >
                  Receive in M2M
              </button>
              }
            </div> : ""
        }

        <Modal isOpen={this.state.modal} toggle={this.toggle} className="receiving-popup">
          <ModalHeader toggle={this.toggle} className="pb-0">Allocate to Sales Order</ModalHeader>
          <ModalBody>
            <form action="">
              <div className="form-row">
                <div className="form-group col-md-3">
                  <label className="font-weight-bold pt-0">Part # :</label>
                  <span className="font-weight-bold ml-1">00-123654</span>
                </div>
                <div className="form-group col-md-3">
                  <label className="font-weight-bold pt-0">Rev:</label>
                  <span className="font-weight-bold ml-1">A</span>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-12">
                  {
                    (this.state.modaldata && this.state.modaldata.length > 0)
                      ? this.loadExtronTable(this.state.modaldata, modalcolumns)
                      : noRecordsAvailable("No Records Available.")
                  }
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            <Button color="primary" onClick={this.toggle}>Allocate</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetch_graphql_response: fetch_graphql_response,
  reset_action: reset_action,
  getReceivingCountAction,
  receiving_queue_m2m,
  reset_receiving_queue_m2m
};

const mapStateToProps = state => {
  return {
    stateOfUser: state.user,
    stateOfReceipts: state.graphql_list,
    stateOfZone: state.storeZoneReducer,
    stateOfReceivingQueueInM2M: state.receiving_queue_m2m
  };
};


ReceivingQueue = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceivingQueue);

export default ReceivingQueue;