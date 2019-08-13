import React from "react";
import ReactTable from "react-table";
import DatePicker from "react-datepicker";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert
} from "reactstrap";
import {
  fetch_graphql_response,
  reset_action
} from "../../reduxUtils/actions/graphql";
import {
  resolve_missing_part_num,
  resolve_missing_part_num_reset
} from "../../reduxUtils/actions/workflow/missingPartNum";
import {
  check_part_m2m,
  reset_part_num
} from "../../reduxUtils/actions/receiving";
import { connect } from "react-redux";
import { Loader, LoadingOverlay } from "react-overlay-loader";
import { ucfirst, formatDate, getValueFromCustomAttribute } from "../../utils/HelperFunctions";
import CONSTANTS from "../../config/constants.json";
import endpoint from "../../config/endpoints";
import { ApolloProvider } from "react-apollo";
import Client from "../Elements/Client";
import SimpleReactValidator from "simple-react-validator";
import { apolloClientGraphQL } from "../../utils/HelperFunctions";
import ExtronTable from "../Elements/ExtronTable";
import { noRecordsAvailable } from "../Elements/NoRecordsAvailable";
import ViewUploadedFiles from "../../utils/ViewUploadedFiles";
import ACTIONS from "../../config/ActionList.json";
import { getReceivingCountAction } from "../../reduxUtils/actions/receiving";

class MissingPartNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      modal: false,
      selected: {},
      selectAll: 0,
      selectedData: [],
      data: [],
      pgSize: 5,
      subPgSize: 3,
      metaRequest: {
        id: 0,
        listType: "MISSING_PART",
        startRowIndex: 0,
        pageSize: 100,
        orderByName: "IdReceiving",
        orderByType: "ASC"
      },
      loaderFooter: false,
      partNumber: [],
      clientName: "",
      clientCode: "",
      carrierName: "",
      partNumberList: [],
      authToken: this.props.stateOfAction.authToken,
      receivingId: 0,
      clientId: null,
      packingSlipNumber: null,
      resolveError: false,
      clientError: false,
      mappedPartNumber: "",
      mappedRevNumber: "",
      clientErrorMsg: "",
      disableSubmit: true,
      onErrorList: false,
      part: "",
      rev: "",
      resolveFlag: true
    };

    this.validator = new SimpleReactValidator({
      validators: {
        required: {
          message: ":field is required",
          rule: (val, params, validator) => {
            return val != "";
          },
          messageReplace: (message, params) =>
            message.replace(
              ":field",
              this.validator.helpers.toSentence(params)
            ),
          required: true
        },
        max: {
          message: "Maximum :field characters are allowed",
          rule: (val, params, validator) => {
            if (val.length > 3) {
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
    this.columns = [
      {
        Header: "Tag #",
        accessor: "tagNumber"
      },
      {
        Header: "Tracking #",
        accessor: "trackingNumber"
      },
      {
        Header: "Client",
        id: "clientName",
        accessor: d => ucfirst(d.clientName)
      },
      {
        Header: "Carrier",
        accessor: "carrierName"
      },
      {
        Header: "Packing Slip",
        accessor: "packingSlipNumber"
      },
      {
        Header: "Papers",
        accessor: "papersCount",
        Cell: ({ original }) => {
          return (
            <ViewUploadedFiles
              attachments={original.attachments.supportingDocuments}
            />
          );
        },
        Filter: ({ filter, onChange }) => (
          <input type="text" disabled className="datatable-input-width" />
        )
      },
      {
        Header: "Pictures",
        accessor: "picturesCount",
        Cell: ({ original }) => {
          return (
            <ViewUploadedFiles attachments={original.attachments.pictures} />
          );
        },
        Filter: ({ filter, onChange }) => (
          <input type="text" disabled className="datatable-input-width" />
        )
      },
      {
        Header: "Received on",
        accessor: "receivedOn",
        Cell: ({ original }) => {
          return formatDate(original.receivedOn);
        }
      },
      {
        Header: CONSTANTS.RECEIVING_MASTER.RESOLVE_DISCREPANCY,
        id: "action",
        Cell: ({ original }) => {
           
          let value = this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.MISSING_PART.RESOLVE_DISCREPANCY);          
          if(value) {
            return (
              <button
              className="btn btn-styling btn-sm"
              value={this.state.receivingId}
              onClick={() => this.populatePartNumbers(original)}
            >
              Assign
            </button>
             );
          }
          return null;
        },
        Filter: ({ filter, onChange }) => (
          <input type="text" disabled className="datatable-input-width" />
        )
      }
    ];

    this.subColumnsInner = [
      {
        Header: "Client",
        id: "clientName",
        Cell: () => {
          return <div>{ucfirst(this.state.clientName)}</div>;
        }
      },
      {
        Header: "Incoming P/N",
        accessor: "partNumber"
      },
      {
        Header: "Incoming Rev #",
        accessor: "revisionNumber"
      },
      {
        Header: "Mapped P/N",
        accessor: "MappedPN",
        Cell: ({ original }) => {
          return (
            <div>
              <input
                type="input"
                className="mapped-text px-2 form-control"
                name={`MappedPN-${original.idReceivingDetail}`}
                id={original.idReceivingDetail}
                onChange={this.changePartNumber}
                value={this.getPart(original.idReceivingDetail)}
              />
              {/* <div className="error">
                {/* "MESSAGE" + {original.idReceivingDetail} */}
              {/* {this.validator.message(
                `MappedPN-${original.idReceivingDetail}`,
                this.state.mappedPartNumber,
                "required:Mapped P/N"
              )} </div>  */}

            </div>
          );
        }
      },
      {
        Header: "Mapped Rev #",
        accessor: "MappedRev",
        Cell: ({ original }) => {
          return (
            <div>
              <input
                type="input"
                className="mapped-text px-2 form-control"
                name={original.idReceivingDetail}
                id={original.idReceivingDetail}
                onChange={this.changeRevNumber}
                value={this.getRev(original.idReceivingDetail)}
              />
              {/* <div className="error">
              {this.validator.message(
                "MappedRev",
                this.state.mappedRevNumber,
                "required:Mapped Revision Number|max:3"
              )}
            </div> */}
            </div>
          );
        }
      }
    ];

    this.subcolumns = [
      {
        Header: "Part #",
        accessor: "partNumber",
        headerClassName: "thead-custom"
      },
      {
        Header: "Rev #",
        accessor: "revisionNumber",
        headerClassName: "thead-custom"
      },
      {
        Header: "Qty Received",
        accessor: "qtyReceived",
        headerClassName: "thead-custom"
      },
      {
        Header: "Boxes",
        accessor: "box",
        headerClassName: "thead-custom"
      },
      {
        Header: "Pallets",
        accessor: "pallet",
        headerClassName: "thead-custom"
      },
      {
        Header: "Lot #",
        accessor: "lotNumber",
        headerClassName: "thead-custom"
      }
    ];
  }

  isActionAllowed = (actionName = "") => {
    return (this.props.actions.indexOf(actionName) >= 0) ? true : false;
  }

  getPart = (value = null) => {
    let value2 = this.state.partNumberList.find(part => part.idReceivingDetail === value);
    return (value2) ? value2.mappedPartNumber : null;
  }

  getRev = (value = null) => {
    let value2 = this.state.partNumberList.find(part => part.idReceivingDetail === value);
    return (value2) ? value2.mappedRevNumber : null;
  }

  populatePartNumbers = data => {
    this.toggle();
    this.setState(
      {
        clientName: data.clientName,
        clientCode: data.clientCode,
        carrierName: data.carrierName,
        clientId: data.idClient,
        receivingId: data.idReceiving,
        packingSlipNumber: data.packingSlipNumber,
        partNumber: data.parts,
        subPgSize: data.parts.length
      },
      () => {
        let parts = this.state.partNumber;
        let tempArray = [];
        parts.map(item => {
          tempArray.push({
            idReceivingDetail: item.idReceivingDetail,
            mappedPartNumber: this.state.mappedPartNumber,
            mappedRevNumber: this.state.mappedRevNumber
          });
        });
        this.setState({
          partNumberList: tempArray
        });
      }
    );
  };

  changePartNumber = e => {
    let partNumberList = this.state.partNumberList;
    let id = e.target.id;
    let value = e.target.value;
    partNumberList.map(partNumber => {
      if (partNumber.idReceivingDetail == id) {
        partNumber.mappedPartNumber = value;
        this.setState(
          {
            part: partNumber.mappedPartNumber,
            rev: (partNumber.mappedRevNumber == null) ? " " : partNumber.mappedRevNumber,
            loaderFooter: true
          },
          () => this.props.check_part_m2m(this.state)
        );
      }
    });

    this.setState({
      partNumberList: partNumberList,
      [e.target.name]: e.target.value
    });
  };

  changeRevNumber = e => {
    let partNumberList = this.state.partNumberList;
    let id = e.target.id;
    let value = e.target.value;
    partNumberList.map(partNumber => {
      if (partNumber.idReceivingDetail == id) {
        partNumber.mappedRevNumber = value;
        this.setState(
          {
            part: partNumber.mappedPartNumber,
            rev: (partNumber.mappedRevNumber == null) ? " " : partNumber.mappedRevNumber,
            loaderFooter: true
          },
          () => {
            if ((partNumber.mappedPartNumber != null) && (partNumber.mappedPartNumber != "")) {
              this.props.check_part_m2m(this.state);
            }
          }
        );
      }
    });
    this.setState({
      partNumberList: partNumberList,
      [e.target.name]: e.target.value
    });
  };

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    if (!this.state.modal) {
      this.setState({
        clientError: false,
        clientErrorMsg: "",
        disableSubmit: false,
        loaderFooter: false,
        resolveFlag: true
      })
    }
  };

  componentWillMount() {
    this.client = apolloClientGraphQL(endpoint.GRAPHQL_URL);
    this.setState({
      loader: true
    });
    this.props.fetch_graphql_response(this.state);
  }

  missingReceiptsResponse = () => {
    if (this.props.stateOfReceipts.status == 200) {
      this.props.getReceivingCountAction({zone:this.props.stateOfZone.zone});
      this.setState(
        {
          data: this.props.stateOfReceipts.data,
          pgSize: this.props.stateOfReceipts.data.length,
          loader: false
        },
        () => this.props.reset_action()
      );
    } else if (this.props.stateOfReceipts.status == 400) {
      this.setState(
        {
          data: this.props.stateOfReceipts.data.errors,
          loader: false
        },
        () => this.props.reset_action()
      );
    }
  };

  checkPartNull = () => {
    let partNumberList = this.state.partNumberList;
    for (let item of partNumberList) {
      if (item.mappedPartNumber === "") {
        return "Please Enter all Mapped P/N.";
      }
      if (item.mappedRevNumber !== "" && item.mappedRevNumber.length > 3) {
        return "Rev Number must be less than 3 characters";
      }
    }
    return false;
  };

  onShowAlert = (message = null) => {
    this.setState({ clientError: true }, () => {
      window.setTimeout(() => {
        this.setState({ clientError: false });
      }, 5000);
    });
  };

  // on resolve discrepancy
  resolveDiscrepancy = () => {
    let clientErrorMsg = "";
    if ((clientErrorMsg = this.checkPartNull())) {
      this.setState({ clientErrorMsg }, () => {
        this.onShowAlert();
      });
    } else {
      if (this.validator.allValid()) {
        this.props.resolve_missing_part_num(this.state);
        // this.setState({
        //   partNumberList: [], receivingId: 0, clientId: null, packingSlipNumber: null,
        //   resolveError: false,
        //   clientError: false,
        //   mappedPartNumber: null,
        //   mappedRevNumber: null
        // });
      } else {
        this.validator.showMessages();
        this.forceUpdate();
      }
    }
  };

  checkResolveError = () => {
    if (this.props.stateOfPartNum.status == 200) {
      this.props.getReceivingCountAction({zone:this.props.stateOfZone.zone});
      swal("Success!", "Discrepancy Resolved ", "success");
      this.setState(
        {
          modal: false,
          resolveError: false,
          clientId: null,
          packingSlipNumber: null,
          receivingId: 0,
          clientError: false
        },
        () => {
          this.props.resolve_missing_part_num_reset(this.state);
          this.props.fetch_graphql_response(this.state);
        }
      );
    }

    // if (this.props.stateOfPartNum.status == 400) {
    //   this.setState({
    //     resolveError: true
    //   });
    //   // }, () => this.props.resolve_missing_part_num_reset()); // TODO - for future use
    // }
  };

  onErrorListFn = () => {
    this.setState(prevState => ({
      onErrorList: !prevState.onErrorList
    }));
  }

  errorLogs = () => {
    if (this.props.stateOfPartNum.status == 400) {
      var errorLogs = this.props.stateOfPartNum.errors;
      var items = [];
      if (errorLogs) {
        errorLogs.forEach((err, i) => {
          items.push(<li className="ml-2">{err}</li>);
        });
      }
      return (
        <div>
          <Alert color="danger">
            {items}
          </Alert>
        </div>
      );
    }
  };

  handleChange = e => {
    let clientCode = getValueFromCustomAttribute(e, 'data-client-code');
    this.setState({
      [e.target.name]: e.target.value,
      clientCode: clientCode,
      loaderFooter: true,
    }, () => this.props.check_part_m2m(this.state));
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
        subComponent={true}
        childRecords={"parts"}
        childColumns={this.subcolumns}
        childPaginationSecondary={true}
        classes="-striped -highlight"
      />
    );
  };

  loadExtronTablePopUp = () => {
    return (
      <ExtronTable
        parentRecords={this.state.partNumber}
        parentColumns={this.subColumnsInner}
        defaultSorted={[{ id: "tagNumber", desc: true }]}
        filterable={false}
        minRows={0}
        defaultPageSize={5}
        showPaginationBottom={true}
        showPaginationTop={false}
      />
    );
  };

  onDismiss = () => {
    this.setState({ clientError: false });
  };

  checkM2MStatus = () => {
    switch (this.props.check_part.status) {
      case 200:
        // this.setStateInspection();
        if ((this.validator.allValid()) && (!(this.checkPartNull()))) {
          this.setState({
            clientError: false,
            clientErrorMsg: "",
            disableSubmit: false,
            loaderFooter: false,
            resolveFlag: false
          });
        }
        this.props.reset_part_num();
        break;
      case 400:
      case 401:
          this.setState({
            clientError: true,
            clientErrorMsg: this.props.check_part.errors[0],
            disableSubmit: true,
            loaderFooter: false,
            resolveFlag: true
          },()=>this.props.reset_part_num());
        // this.setState({ pnNotFound: "checked" });
        break;
      case 404:
        // this.setState({ pnNotFound: "checked" });
        this.setState({
          clientError: true,
          clientErrorMsg: CONSTANTS.RECEIVING_MASTER.PART_NUMBER_NOT_FOUND,
          disableSubmit: true,
          loaderFooter: false,
          resolveFlag: true
        });
        this.props.reset_part_num();
        break;
      default:
    }
  };

  render() {
    this.checkM2MStatus();
    this.missingReceiptsResponse();
    this.checkResolveError();
    return (
      <div>
        <Loader fullpage loading={this.state.loader} />
        {/* <div className="col-md-12">
          <div className="row">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Carrier</label>
                <select className="form-control" id="carrier" name="carrier">
                  <option value="all">All</option>
                </select>
              </div>
              <div className="form-group col-md-6">
                <label>Received on</label>
                <DatePicker
                  className="form-control"
                  selected={this.state.startDate}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
        </div> */}
        {/*rendering datatable */}
        {this.state.data && this.state.data.length > 0
          ? this.loadExtronTable()
          : noRecordsAvailable("No Records Found.", "")}
        {/* <button type="button" className="btn btn-primary float-right mt-3" onClick={this.toggle}>Edit Selected</button> */}
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className="missing-popup modal-width"
        >
          <ModalHeader toggle={this.toggle}>Resolve Missing Info </ModalHeader>
          <ModalBody>
            <Loader loading={this.state.loader} />
            {this.errorLogs()}
            <Alert
              color="danger"
              isOpen={this.state.clientError}
              toggle={this.onDismiss}
            >
              {this.state.clientErrorMsg}
            </Alert>
            {/* )} */}
            <form action="">
              <div className="form-row">
                <div className="form-group col-md-3">
                  <label>{CONSTANTS.RECEIVING_MASTER.ASSIGNED_TO_CLIENT}</label>
                </div>
                <div className="form-group col-md-5">
                  {/* <ApolloProvider client={this.client}>
                    <select className="form-control" id="clientId" name="clientId">
                      <Client param={this.state.clientId} />
                    </select>
                  </ApolloProvider> */}

                  <ApolloProvider client={this.client}>
                    <select
                      className="form-control"
                      id="clientId"
                      name="clientId"
                      value={this.state.clientId}
                      onChange={this.handleChange}
                    >
                      <Client param={this.state.clientId} />
                    </select>
                  </ApolloProvider>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-12 mb-2">
                  <p className="p-0">{CONSTANTS.RECEIVING_MASTER.PN_INFO}</p>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-12">
                  {// (this.state.partNumber && this.state.data.partNumber > 0)
                    // ? this.loadExtronTablePopUp()
                    // : noRecordsAvailable("No Records Found.", "")
                    this.loadExtronTablePopUp()}
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter>
            {this.state.loaderFooter && <span>Please wait...</span>}
            <div className={this.state.loaderFooter ? "fadeOut" : undefined}>
              <Button
                color="secondary"
                onClick={this.toggle}
                className="mr-1">
                Cancel
              </Button>
              {this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.MISSING_PART.RESOLVE_DISCREPANCY) && 
              <Button
                color="primary"
                onClick={() => this.resolveDiscrepancy()}
                disabled={this.state.resolveFlag}>
                Resolve Discrepancy
              </Button>
              }
            </div>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  fetch_graphql_response: fetch_graphql_response,
  resolve_missing_part_num: resolve_missing_part_num,
  resolve_missing_part_num_reset: resolve_missing_part_num_reset,
  reset_action: reset_action,
  check_part_m2m,
  reset_part_num,
  getReceivingCountAction
};

const mapStateToProps = state => {
  return {
    stateOfAction: state.user,
    stateOfReceipts: state.graphql_list,
    stateOfPartNum: state.missing_part_num,
    check_part: state.checkPartReducer,
    stateOfZone: state.storeZoneReducer
  };
};

MissingPartNumber = connect(
  mapStateToProps,
  mapDispatchToProps
)(MissingPartNumber);

export default MissingPartNumber;
