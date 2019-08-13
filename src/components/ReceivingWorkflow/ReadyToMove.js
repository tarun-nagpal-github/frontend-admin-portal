import React from "react";
import ReactTable from "react-table";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { fetch_graphql_response, reset_action } from "../../reduxUtils/actions/graphql";
import { connect } from "react-redux";
import { Loader, LoadingOverlay } from "react-overlay-loader";

import ExtronTable from "../Elements/ExtronTable";
import { noRecordsAvailable } from "../Elements/NoRecordsAvailable";
import ViewUploadedFiles from "../../utils/ViewUploadedFiles";
import { ucfirst, formatDate } from "../../utils/HelperFunctions";
import { print_label, reset_print_label } from "../../reduxUtils/actions/printActions";
import { getReceivingCountAction } from "../../reduxUtils/actions/receiving";

class ReadyToMove extends React.Component {
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
      partNumber: null,
      revisionNumber: null,
      authToken: this.props.stateOfUser.authToken,
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
        // "listType": "READYTOMOVE",
        "listType": "TAG",
        "startRowIndex": 0,
        "pageSize": 100,
        "orderByName": "IdReceiving",
        "orderByType": "ASC"
      },
      clientError: false
    };
    this.columns = [
      {
        Header: '',
        accessor: '',
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
        accessor: 'tagNumber',
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
        Header: 'PO #',
        accessor: 'm2MPONumber',
      },
      {
        Header: 'Receiver #',
        accessor: 'm2MReceiverNumber',
      },
      {
        Header: 'Added to Inventory On',
        accessor: 'm2MReceivedDt',
      },
      {
        Header: 'Added By',
        accessor: 'addedInM2MBy',
      },
      {
        Header: 'Papers',
        accessor: 'papersCount',
        Cell: ({ original }) => {
          return (original) ? <ViewUploadedFiles attachments={original.attachments.supportingDocuments} /> : null;
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
        headerClassName: 'thead-custom',
      }, {
        Header: 'Pallets',
        accessor: 'pallet',
        headerClassName: 'thead-custom',
      }, {
        Header: 'Lot #',
        accessor: 'lotNumber',
        headerClassName: 'thead-custom',
      },{
        Header: 'Print',
        accessor: 'Print',
        headerClassName: 'thead-custom',
        Cell: ({ original }) => {
          return (
            <i onClick={() => this.printLabel(original.partNumber, original.revisionNumber)} className="fa fa-print fa-2x" style={{cursor:"pointer"}}></i>
          );
        },
      }
    ];
  }

  componentWillMount() {
    this.setState({
      loader: true
    });
    this.props.fetch_graphql_response(this.state);
  }

  printLabel = (partNumber, revisionNumber) => {
    this.setState({
      revisionNumber,
      partNumber
    },() => this.props.print_label(this.state))
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
    if (newSelected[data.idReceiving] == true) {
      selectedData[data.idReceiving] = data;
      this.setState({
        selectedData: selectedData,
        selected: newSelected,
        selectAll: 2
      });
    } else {
      this.setState({
        selectedData: selectedData.filter(record => record.idReceiving != data.idReceiving),
        selected: newSelected,
        selectAll: 0
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
      selectAll: this.state.selectAll === 0 ? 1 : 0
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

  recievingReceiptsResponse = () => {
    if (this.props.stateOfReceipts.status == 200) {
      this.props.getReceivingCountAction({zone:this.props.stateOfZone.zone});
      this.setState({
        data: this.props.stateOfReceipts.data,
        pgSize: this.props.stateOfReceipts.data.length,
        loader: false
      }, () => this.props.reset_action());
    } else if (this.props.stateOfReceipts.status == 400) {
      this.setState({
        errors: this.props.stateOfReceipts.data.errors,
        loader: false,
        serverErrors: true
      }, () => this.props.reset_action());
    }
  }

  onDismiss =() => {
    this.setState(prevState => ({
      clientError: !prevState.clientError
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
        childPaginationSecondary={true}
        classes="-striped -highlight"
      />
    )
  }

  moveToWarehouseButton = () => {
    return (
      <div className="moveWarehouse" style={{ paddingBottom: 38 }} >
        <button type="button" className="btn btn-primary float-right mt-3">Move to Warehouse</button>
      </div>
    );
  }

  render() {
    this.recievingReceiptsResponse();
    { this.errorLogs() }
    const modalcolumns = [{
      Header: '',
      accessor: '',
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
        <Loader fullpage loading={this.state.loader} />
        {
          /* rendering datatable */

          (this.state.data && this.state.data.length > 0)
            ? this.loadExtronTable()
            : noRecordsAvailable("No Records Found.", "")
        }
        {
          (this.state.data && this.state.data.length > 0)
            ? this.moveToWarehouseButton()
            : <div></div>
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
                  <ReactTable
                    className="text-center"
                    data={this.state.modaldata}
                    columns={modalcolumns}
                    defaultPageSize={10}
                    filterable={true}
                  />
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
  reset_print_label,
  print_label,
  getReceivingCountAction
};

const mapStateToProps = state => {
  return {
    stateOfUser: state.user,
    stateOfReceipts: state.graphql_list,
    stateOfPrintLabel: state.label_reducer,
    stateOfZone: state.storeZoneReducer
  };
};


ReadyToMove = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReadyToMove);

export default ReadyToMove;