import React from "react";
import ReactTable from "react-table";
import DatePicker from "react-datepicker";
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { fetch_graphql_response, reset_action } from "../../reduxUtils/actions/graphql";
import { connect } from "react-redux";
import CONSTANTS from "../../config/constants.json";
import Carriers from "../Elements/carriers";
import endpoint from "../../config/endpoints";
import { ApolloProvider } from "react-apollo";
import { apolloClientGraphQL, errorList } from "../../utils/HelperFunctions";
import Client from "../Elements/Client";
import { Loader, LoadingOverlay } from "react-overlay-loader";
import { resolve_discrepancy, resolve_discrepancy_reset } from "../../reduxUtils/actions/workflow/orphans";
import { getReceivingCountAction } from "../../reduxUtils/actions/receiving";
import swal from "sweetalert";
import SimpleReactValidator from "simple-react-validator";
import {
  fileUpload,
  isValidExtension,
  isValidFileSize,
  validDocumentExtensions
} from "../../services/FileUploadService";
import "./OrphanReceipts.css";

import ExtronTable from "../Elements/ExtronTable";
import { noRecordsAvailable } from "../Elements/NoRecordsAvailable";
import ViewUploadedFiles from "../../utils/ViewUploadedFiles";
import { formatDate } from "../../utils/HelperFunctions";
import ACTIONS from "../../config/ActionList.json";

class OrphanReceipts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: this.props.stateOfAction.authToken,
      startDate: new Date(),
      modal: false,
      selected: {},
      selectAll: 0,
      selectedData: [],
      data: [],
      pgSize: 5,
      loader: false,
      tabbordericon: '1',
      onSuccessTimeout: false,
      metaRequest: {
        "id": 0,
        "listType": "MISSING_CLIENT",
        "startRowIndex": 0,
        "pageSize": 100,
        "orderByName": "IdReceiving",
        "orderByType": "ASC"
      },
      receivingId: 0,
      clientId: null,
      packingSlipNumber: null,
      resolveError: false,
      clientError: false,
      errorLogs: null,
      showUploadedItems: false,
      alertError: false,
      alertErrorOnResolve: false,
      alertErrorOnClient: false
    };
    this.columns = [{
      Header: 'Tag #',
      accessor: 'tagNumber',
      filterable: true
    }, {
      Header: 'Track #',
      accessor: 'trackingNumber',
      filterable: true
    }, {
      Header: 'Client',
      accessor: 'clientName',
      filterable: true
    }, {
      Header: 'Carrier',
      accessor: 'carrierName',
      filterable: true
    }, {
      Header: 'Packing Slip',
      accessor: 'packingSlipNumber',
      filterable: true
    },
    {
      Header: 'Received on',
      filterable: true,
      id: "ReceivedOn",
      accessor: original => {
        return formatDate(original.receivedOn);
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
      Filter: ({ }) => (
        <input type="text" disabled className="datatable-input-width" />
      ),
    },
    {
      Header: 'Assign',
      accessor: 'Assign',
      Cell: ({ original }) => {
        let value = this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.ORPHAN.RESOLVE_DISCREPANCY);
        if (value) {
          return (
            <button className="btn btn-styling btn-sm" value={this.state.receivingId} onClick={() => this.toggleView(original.idClient, original.idReceiving, original.packingSlipNumber)}>
              Resolve
           </button>
          );
        }
        return null;
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
      }
    ];

    this.initForm();
  }

  initForm = () => {
    this.validator = new SimpleReactValidator({
      validators: {
        required: {
          message: ":field is required",
          rule: (val, params, validator) => {
            if (val == "" || val == "none") {
              return false;
            }
          },
          messageReplace: (message, params) =>
            message.replace(
              ":field",
              this.validator.helpers.toSentence(params)
            ),
          required: true
        }
      }
    });
  }

  isActionAllowed = (actionName = "") => {
    return (this.props.actions.indexOf(actionName) >= 0) ? true : false;
  }


  showUploadedDocs = () => {
    this.setState({
      showUploadedItems: true
    })
  }
  tabbordericon(tab) {
    if (this.state.tabbordericon !== tab) {
      this.setState({
        tabbordericon: tab
      });
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
        subComponent={true}
        childRecords={"parts"}
        childColumns={this.subcolumns}
        childPaginationSecondary={true}
        classes="-striped -highlight"
      />
    )
  }

  componentWillMount() {
    this.client = apolloClientGraphQL(endpoint.GRAPHQL_URL);
    this.setState({
      loader: true
    });
    this.props.fetch_graphql_response(this.state);
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleIdChange = (idReceiving = null) => {
    this.setState({
      receivingId: idReceiving
    });
  }

  toggleView = (clientId = "", receivingId = "", packingSlipNumber = "") => {
    this.setState(
      prevState => ({
        modal: !prevState.modal,
        packingSlipNumber,
        receivingId,
        clientId
      })
    );
  }

  initState = () => {
    if (!this.state.modal) {
      this.setState({
        clientId: null,
        packingSlipNumber: null,
        receivingId: null
      });
    }
  }

  toggle = () => {
    this.setState(
      prevState => ({
        modal: !prevState.modal
      })
    );
    // this.initState();
  }

  orphanReceiptsResponse = () => {
    if (this.props.stateOfReceipts.status == 200) {
      this.props.getReceivingCountAction({zone:this.props.stateOfZone.zone});
      this.setState({
        data: this.props.stateOfReceipts.data,
        pgSize: this.props.stateOfReceipts.data.length,
        loader: false
      }, () => this.props.reset_action());
    } else if (this.props.stateOfReceipts.status == 400) {
      this.setState({
        errorLogs: this.props.stateOfReceipts.errors,
        loader: false
      }, () => this.props.reset_action());
    }
  }

  checkResolveError = () => {
    if (this.props.stateOfDiscrepancy.resolveDiscrepancyStatus == 200) {
      this.props.getReceivingCountAction({zone:this.props.stateOfZone.zone});
      this.setState({
        resolveError: false,
        clientId: null,
        packingSlipNumber: null,
        receivingId: 0,
        onSuccessTimeout: true
      }, () => {
        this.initForm();
        this.props.resolve_discrepancy_reset();
        this.props.fetch_graphql_response(this.state);
      });
    }

    if (this.props.stateOfDiscrepancy.resolveDiscrepancyStatus == 400) {
      this.setState({
        resolveError: true,
        errorLogs: this.props.stateOfDiscrepancy.errors
      }, () => this.props.resolve_discrepancy_reset());
    }
  }

  resolveDiscrepancy = () => {
    if (this.validator.allValid()) {
      this.props.resolve_discrepancy(this.state)
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  uploadDocument = async e => {
    let PAPER_WORK = 27;
    let payload = {};
    payload.file = e.target.files[0];
    payload.IdReceiving = this.state.receivingId;
    payload.attachmentType = PAPER_WORK;
    payload.authToken = this.props.stateOfAction.authToken;

    if (!isValidExtension(e.target, validDocumentExtensions)) {
      swal(CONSTANTS.FILE.INVALID_DOCUMENT);
    } else if (!isValidFileSize(payload.file.size)) {
      swal(CONSTANTS.FILE.INVALID_SIZE);
    } else {
      this.setState({ loader: true });
      let result = await fileUpload(payload);
      if (result.status == 200) {
        swal(CONSTANTS.FILE.UPLOAD_SUCCESS);
        this.setState({ loader: false });
      } else {
        swal(CONSTANTS.FILE.UPLOAD_FAILURE);
        this.setState({ loader: false });
      }
    }
  };

  scrollToTopFunc = () => window.scrollTo(0, 0);

  alertErrorFn = () => {
    this.setState(prevState => ({
      alertError: !prevState.alertError
    }));
  }

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



  changeHandler = () => {
    this.setState({
      showUploadedItems: false
    })
  }

  alertErrorResolveFn = () => {
    this.setState(prevState => ({
      alertErrorOnResolve: !prevState.alertErrorOnResolve
    }));
  }

  alertErrorClientFn = () => {
    this.setState(prevState => ({
      alertErrorOnClient: !prevState.alertErrorOnClient
    }));
  }

  timeoutAlert = () => {
    setTimeout(() => {
      this.setState({
        modal: false,
        onSuccessTimeout: false
      })
    }, 2000);
    return (
      <div>
        <Alert color="success">
          {CONSTANTS.RECEIVING_MASTER.ON_DISCREPANCY_SUCCESS}
        </Alert>
      </div>
    )
  }

  render() {
    this.orphanReceiptsResponse();
    this.checkResolveError();
    return (
      <div>
        {this.errorLogs()}
        <Loader fullpage loading={this.state.loader} />
        <div className="form-group">
          {
            /* rendering datatable */
            (this.state.data && this.state.data.length > 0)
              ? this.loadExtronTable()
              : noRecordsAvailable("No Records Found.", "")
          }
        </div>
        {/* <Card className="card-statistics mb-3">
          <CardBody> */}
        {/* <div className="row mb-4">
          <div className="col-md-3">
            <label>{CONSTANTS.RECEIVING_DASHBOARD.CARRIER}</label>
            <ApolloProvider client={this.client}>
              <select className="form-control" id="carrier" name="carrier">
                <Carriers />
              </select>
            </ApolloProvider>
          </div>
          <div className="col-md-3">
            <label>{CONSTANTS.RECEIVING_DASHBOARD.RECEIVED_ON}</label>
            <DatePicker
              className="form-control"
              selected={this.state.startDate}
              onChange={this.handleChange}
            />

          </div>
        </div> */}

        {/* <div className="row">
          <div className="col-md-12">
            <button type="button" className="btn btn-primary float-right mt-3">{CONSTANTS.GENERIC.EDIT_SELECTED}</button>
          </div>
        </div> */}
        {/* </CardBody>
        </Card> */}
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className + " modal-width-orphan"}>
          <ModalHeader toggle={this.toggle}>{CONSTANTS.RECEIVING_MASTER.MODAL_HEADER}</ModalHeader>
          <ModalBody>
            <Loader loading={this.state.loader} />
            {/*Message form server*/}
            {this.state.onSuccessTimeout ? this.timeoutAlert() : ""}
            {this.state.resolveError ? errorList(this.state.errorLogs) : ""}
            <div className="form-row">
              <div className="form-group col-md-4">
                <label>{CONSTANTS.RECEIVING_MASTER.TO_CLIENT}</label>
              </div>
              <div className="form-group col-md-8">
                <ApolloProvider client={this.client}>
                  <select className="form-control" id="clientId" name="clientId" value={this.state.clientId} onChange={this.handleChange}>
                    <option value="none">Select Client</option>
                    <Client param={this.state.clientId} />
                  </select>
                </ApolloProvider>
                <div className="error">
                  {this.validator.message(
                    "Client",
                    this.state.clientId,
                    "required:Client"
                  )}
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label>{CONSTANTS.RECEIVING_MASTER.TO_PACKING_SLIP}</label>
              </div>
              <div className="form-group col-md-8">
                <input type="text" className="form-control" id="packingSlipNumber" name="packingSlipNumber" value={this.state.packingSlipNumber} onChange={this.handleChange} placeholder="Packing Slip Number" />
                <div className="error">
                  {this.validator.message(
                    "Package Slip Number",
                    this.state.packingSlipNumber,
                    "required:Package Slip Number"
                  )}
                </div>
              </div>
            </div>
            {this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.ORPHAN.UPLOAD_DOCS) &&
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label>{CONSTANTS.RECEIVING_DASHBOARD.ATTACHMENT}</label>
                </div>
                <div className="form-group col-md-8">
                  <input type="file" className="form-control" id="attachment" name="attachment" onChange={this.uploadDocument} />
                </div>
              </div>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>{CONSTANTS.GENERIC.BUTTONS.CANCEL}</Button>
            {this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.ORPHAN.RESOLVE_DISCREPANCY) &&
              <Button color="primary" onClick={() => this.resolveDiscrepancy()}> {CONSTANTS.RECEIVING_DASHBOARD.RESOLVE_DISCREPANCY}</Button>
            }
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetch_graphql_response: fetch_graphql_response,
  resolve_discrepancy: resolve_discrepancy,
  resolve_discrepancy_reset: resolve_discrepancy_reset,
  reset_action: reset_action,
  getReceivingCountAction
};

const mapStateToProps = state => {
  return {
    stateOfAction: state.user,
    stateOfReceipts: state.graphql_list,
    stateOfDiscrepancy: state.orphan_receipts,
    stateOfZone: state.storeZoneReducer
  };
};

OrphanReceipts = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrphanReceipts);

export default OrphanReceipts;