import React from "react";
import DatePicker from "react-datepicker";
import { Card, CardBody, CardTitle, CardText, ModalFooter, Modal, Button, ModalHeader, Alert } from "reactstrap";
import SimpleReactValidator from "simple-react-validator";
import PartNumber from "./PartNumber";
import CONSTANTS from "../../config/constants.json";
import { getTooltip } from "../../services/ToolTipService";
import ReactTooltip from "react-tooltip";
import {
  create_receiving,
  reset_action,
  close_receiving,
  edit_reciept_reset
} from "../../reduxUtils/actions/receiving";
import { connect } from "react-redux";
import endpoint from "../../config/endpoints";
import { ApolloProvider } from "react-apollo";
import Carriers from "../Elements/carriers";
import FulfillmentZone from "../Elements/FulfillmentZone";
import Client from "../Elements/Client";
import Pools from "../Elements/Pools";
import { Redirect } from "react-router";
import PaperWork from "./PaperWork/PaperWork.js";
import Pictures from "./Pictures/Pictures.js";
import { Dropdown } from "semantic-ui-react";
import { discrepancyQuery } from "../../config/graphqlQuery";
import { Loader, LoadingOverlay } from "react-overlay-loader";
import swal from "sweetalert";
import SweetAlert from "react-bootstrap-sweetalert";
import { getPartNumberList } from "../../services/Receiving";
import { RECEIPT_STATUS } from "./ReceivingHelper";
import { currentRoute } from "../../reduxUtils/actions/currentRoute";
import { copyToClipboard, printDocumentPopUp, isActionAllowed } from '../../utils/HelperFunctions';
const CONSTANTS_RECEIVING = CONSTANTS.RECEIVE_AT_DOCK_ADD;
import { apolloClientGraphQL, getValueFromCustomAttribute } from "../../utils/HelperFunctions";
import { fetch_helptext, reset_helpertext } from "../../reduxUtils/actions/generic";
import Containers from "../Elements/Containers";
import { print_tag_receipt, reset_print_tag_receipt } from "../../reduxUtils/actions/printActions";
import { ToastContainer, toast } from "react-toastify";
import PrintDocument from "../../utils/PrintDocument";
import ACTIONS from "../../config/ActionList.json";
const ACTION = ACTIONS.RECIEVING.DOCK;
import fetch from 'unfetch';


class ReceivingAtDock extends React.Component {
  constructor(props) {
    super(props);

    this.props.reset_action();
    this.validator = new SimpleReactValidator({
      validators: {
        checkPaperworkStateValidator: {
          message: "Packing slip/BOL is required.",
          rule: (val, params, validator) => {
            if (params == "" && val == "") {
              return false;
            }
          },
          required: true
        },
        clientValidator: {
          message: "Client is required.",
          rule: (val, params, validator) => {
            if (val == "none") {
              return false;
            }
          },
          required: true
        },
        zoneValidator: {
          message: "Zone is required.",
          rule: (val, params, validator) => {
            if (params != "none" && params != 0 && (val == "none" || val == 0)) {
              return false;
            }
          },
          required: true
        },
        poolValidator: {
          message: "Client or Zone not selected. Please select them to view Pools.",
          rule: (val, params, validator) => {
            if (params == "none" || val == "none") {
              return false;
            }
          },
          required: true
        },
        carrierValidator: {
          message: "Carrier is required.",
          rule: (val, params, validator) => {
            if (val == "none") {
              return false;
            }
          },
          required: true
        },
        required: {
          message: ":field is required",
          rule: (val, params, validator) => {
            return val != "" || val != "none";
          },
          messageReplace: (message, params) =>
            message.replace(
              ":field",
              this.validator.helpers.toSentence(params)
            ),
          required: true
        },
        trackingNumberCheck: {
          message: "Tracking Number is required",
          rule: (val, params, validator) => {
            if(params == "true" && val == ""){
              return false;
            }
          },
          required: true
        }
        // requiredContainer: {
        //   message: "Container is required.",
        //   rule: (val, params, validator) => {
        //     if (val == "none") {
        //       return false;
        //     }
        //   },
        //   required: true
        // }
      }
    });

    this.selectedPaperworkTemp = [];
    this.selectedPicturesTemp = [];
    this.state = {
      idReceiving: null,
      receivedOn: new Date(),
      client: "none",
      container: "",
      zone: "none",
      pool: "none",
      partN: [],
      packing: "",
      noPaperWork: "",
      fullfilmentState: "disabled",
      zoneState: "disabled",
      discrepency: ["none"],
      packingState: "",
      carrier: "none",
      trackingNumber: "",
      authToken: this.props.stateOfAction.authToken,
      info: [],
      isTooltipEnable: true,
      redirectState: false,
      receivingId: 0,
      tagNumber: "",
      discrepancy: [],
      refresh: false,
      loader: null,
      partNumber: [],
      pnflag: false,
      receiptStatus: "",
      loaderPN: false,
      isConfirmClose: false,
      clientErrors: [],
      tooltip: "tt_receiving_at_docks",
      alertError: true,
      alertErrorClose: false,
      alertErrorClient: false,
      alertErrorOnPN: false,
      clientCode: "",
      carrierIsRequired: ""
    };

    this.discrepancy = [];
    this.minDate = new Date();
    this.minDate = this.minDate.setDate(this.minDate.getDate() - 5);
  }

  isActionAllowed = (actionName = "") => {
    return (this.props.actions.indexOf(actionName) >= 0) ? true : false;
  }


  componentWillUnmount() {
    this.props.reset_action();

    // this.props.reset_print_tag_receipt();
  }

  componentWillMount() {
    if (this.state.isTooltipEnable) {
      this.props.fetch_helpertext(this.state.tooltip);
    }
    this.props.currentRoute(location.hash); // TODO: will refine this code
    this.fetchDiscrepancy();
    this.client = apolloClientGraphQL(endpoint.GRAPHQL_URL);
  }

  getPartNumberResponse = async () => {
    if (this.props.stateOfPN.status == 200) {
      this.setState({
        receivingId:
          this.props.stateOfPN.data != null
            ? this.props.stateOfPN.data.receivingid
            : this.state.receivingId,
        tagNumber:
          this.props.stateOfPN.data != null
            ? this.props.stateOfPN.data.tagnumber
            : this.state.tagNumber
      });
    }
  };

  containerHandler = e => {
    this.setState({
      container: e.target.value
    });
  };

  fetchDiscrepancy = () => {
    fetch(endpoint.GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: discrepancyQuery
      })
    })
      .then(response => {
        return response.json();
      })
      .then(responseAsJson => {
        responseAsJson.data.lookup.map((value, i) => {
          this.discrepancy.push({
            key: value.constantId,
            value: value.constantId,
            text: value.constantExpression
          });
        });
        this.setState({
          refresh: true
        });
      });
  };

  handleChange = e => {
    if (e.target.name == "noPaperWork") {
      this.setState(prevState => ({
        packingState: prevState.packingState == "disable" ? "" : "disable",
      }));
    }
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  selectedDateHandle = date => {
    this.setState({
      receivedOn: date
    });
  };

  getPackingSlip = () => {
    return this.state.packingState != "disabled" ? this.state.packing : "";
  };

  sendReceiver = () => {
    if (this.validator.allValid()) {
      var packingSlip = this.getPackingSlip();
      this.setState(
        {
          packing: packingSlip,
          zone: this.props.stateOfZone.zone
        },
        () => {
          this.props.create_receiving(this.state);
        }
      );
    } else {
      this.scrollToTopFunc();
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  scrollToTopFunc = () => window.scrollTo(0, 0);

  closeReceiver = () => {
    if (this.validator.allValid()) {
      if ((this.state.pnflag)) {
        this.setState({ clientErrors: ["Part Number is required."] });
      } else {
        this.setState({
          isConfirmClose: true,
          clientErrors: [],
          zone: this.props.stateOfZone.zone
        });
      }
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  clientSelection = e => {
    let selectedOption = e.target.value;
    let clientCode = getValueFromCustomAttribute(e, 'data-client-code');
    this.setState({
      client: selectedOption,
      clientCode: clientCode,
      zoneState: (selectedOption == "none") ? "disabled" : "",
      fullfilmentState: (selectedOption == "none") ? "disabled" : "",
      zone: "none",
      pool: "none"
    });
  };

  redirectTo = () => {
    if (this.state.redirectState) {
      return <Redirect to="/receiving-at-dock-dashboard" />;
    }
  };

  printTagReceipt = () => {
    this.props.print_tag_receipt(this.state);
  }

  tagNumberView = () => {
    if (this.state.tagNumber != "") {
      return (
        // <div>
        //   <h6 className="float-right font-weight-bold">
        // <i className="fa-lg fa fa-print ml-2" style={{ cursor: "pointer" }} />
        <i className="fa-lg fa fa-print ml-2" style={{ cursor: "pointer" }} onClick={() => this.printTagReceipt()} />
        //   </h6>
        // </div>
      );
    }
  };

  setEditForm() {
    if (this.props.stateReciept.status == 200) {
      let formValues = this.props.stateReciept.recieptDetails;
      let nowDate = new Date(formValues.receivedOn);
      this.minDate = nowDate.setDate(nowDate.getDate() - 5);
      this.setState(
        {
          receivingId: formValues.idReceiving,
          tagNumber: formValues.tagNumber,
          container: formValues.idContainerType,
          zone: formValues.idFulfillmentZone,
          client: formValues.idClient,
          pool: formValues.idPool,
          carrier: formValues.idCarrier,
          trackingNumber: formValues.trackingNumber,
          receivedOn: formValues.receivedOn,
          packing: formValues.packingSlipNumber,
          discrepancy: formValues.discrepancy,
          receiptStatus:
            formValues.status == RECEIPT_STATUS.CLOSED && !this.isActionAllowed(ACTIONS.RECIEVING.DOCK.EDIT_RECEIPT) ? "disabled" : "",
          zoneState: formValues.idFulfillmentZone == "0" && !this.isActionAllowed(ACTIONS.RECIEVING.DOCK.EDIT_RECEIPT) ? "disabled" : "",
          fullfilmentState: formValues.idPool == "0" && !this.isActionAllowed(ACTIONS.RECIEVING.DOCK.EDIT_RECEIPT) ? "disabled" : "",
          packingState: formValues.packingSlipNumber == "" && !this.isActionAllowed(ACTIONS.RECIEVING.DOCK.EDIT_RECEIPT) ? "disabled" : "",
          loaderPN: true
        },
        () => {
          this.getPartNumberListInit();
          this.props.edit_reciept_reset();
        }
      );
    }
  }

  alertToggleOnError = () => {
    this.setState(prevState => ({
      alertError: !prevState.alertError
    }));
  }

  alertToggleOnErrorClose = () => {
    this.setState(prevState => ({
      alertErrorClose: !prevState.alertErrorClose
    }));
  }

  alertToggleOnErrorClient = () => {
    this.setState(prevState => ({
      alertErrorClient: !prevState.alertErrorClient
    }));
  }

  alertToggleOnErrorPN = () => {
    this.setState(prevState => ({
      alertErrorOnPN: !prevState.alertErrorOnPN
    }));
  }

  closeAlertBox = () => {
    setTimeout(() => {
      this.alertToggleOnError();
      this.props.scanned_per_box_reset();
    }, 3000);
  }

  errorLogs = () => {
    if (this.props.stateOfReceiving.status == 400) {
      var errorLogs = this.props.stateOfReceiving.errors;
      var items = [];
      errorLogs.forEach((err, i) => {
        items.push(<li className="ml-2" key={i}>{err}</li>);
      });
      this.closeAlertBox();
      this.scrollToTopFunc();
      return (
        <div>
          <Alert color="danger">
            {items}
          </Alert>
        </div>
      );
    }



    if (this.props.stateOfClose.status == 400) {
      var errorLogs = this.props.stateOfClose.errors;
      var items = [];
      errorLogs.forEach((err, i) => {
        items.push(<li className="ml-2" key={i}>{err}</li>);
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

    if (((this.state.clientErrors) && (this.state.clientErrors.length > 0)) && this.state.pnflag) {
      var errorLogs = this.state.clientErrors
      var items = [];
      errorLogs.forEach((err, i) => {
        items.push(<li className="ml-2" key={i}>{err}</li>);
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

  errorListForPN = () => {
    if (this.props.stateOfPN.status == 400) {
      var logs = this.props.stateOfPN.errors;
      var items = [];

      logs.forEach((err, i) => {
        items.push(<li className="ml-2" key={i}>{err}</li>);
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
  }

  selectDiscrepancy = (e, { value }) => {
    this.setState({
      discrepancy: value
    });
  };

  notifyOnClose = (message) => {
    var options = {
      onClose: () => {
        this.props.reset_action();
        this.setState({
          redirectState: true
        });
      }, pauseOnHover: false,
      closeButton: false,
      closeOnClick: false
    };
    return toast.success(message, options);
  }

  notifyOnSave = (message) => {
    var options = {
      onClose: () => {
        this.setState({
          redirectState: true
        });
      }
      , pauseOnHover: false,
      closeButton: false,
      closeOnClick: false
    };
    return toast.success(message, options);
  }

  saveReceiptResponse = () => {
    if (this.props.stateOfClose.status == 200) {
      var message = "Please keep Tag Number " + this.state.tagNumber + " as your reference.";
      this.notifyOnClose(message);
    }

    if (this.props.stateOfReceiving.status == 200) {
      var comingReceivingId = this.props.stateOfReceiving.data.receivingid;
      var comingTagNumber = this.props.stateOfReceiving.data.tagnumber;
      this.props.reset_action();

      if (this.state.receivingId == 0) {
        this.setState(
          {
            receivingId: comingReceivingId,
            tagNumber: comingTagNumber
          },
          () => {
            var message = "Please keep Tag Number " + this.state.tagNumber + " as your reference.";
            this.notifyOnSave(message);
          }
        );
      } else {
        var message = "Please keep Tag Number " + this.state.tagNumber + " as your reference.";
        this.notifyOnSave(message);
      }
    }
  };

  getPartNumberListInit = async () => {
    let results = await getPartNumberList(
      {
        "authToken": this.state.authToken,
        "receivingid": this.state.receivingId
      });
    this.setState({
      partNumber: results.data.data,
      pnflag: true,
      loaderPN: false
    });
  };

  onCallbackStateUpdate = flag => {
    this.setState({
      pnflag: flag
    });
  };

  showFormValidation = () => {
    if (!this.validator.allValid()) {
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  receivingIsClosed = () => {
    if (this.state.receiptStatus == "disabled") {
      return (
        <div>
          <Alert color="warning" className="align-center text-center font-weight-bold">
            <h4>{CONSTANTS_RECEIVING.RECEIVING_CLOSED}</h4>
          </Alert>
        </div>
      );
    } else {
      return "";
    }
  };

  changeHandler = (receivingId = null) => {
    this.setState({
      receivingId: receivingId
    })
  }

  showConfirmBox = () => {
    return (
      <Modal isOpen={this.state.isConfirmClose} toggle={() => this.setState({ isConfirmClose: false })}>
        <ModalHeader toggle={() => this.setState({ isConfirmClose: false })}>
          <h4 className="modal-title">
            Are you sure you want to close this receipt?
         </h4>
        </ModalHeader>
        <ModalFooter>
          <Button color="danger" onClick={() => {
            this.setState({ isConfirmClose: false })
            this.props.close_receiving(this.state)
          }}>
            Yes
         </Button>
          <Button
            color="secondary"
            data-dismiss="modal"
            onClick={() => this.setState({ isConfirmClose: false })}
          >
            No
         </Button>
        </ModalFooter>
      </Modal>
    );
  }
  responseHelptext = () => {
    if (this.props.stateOfGenerics.status == 200) {
      var tooltipData = [];
      this.props.stateOfGenerics.data.forEach((val, index) => {
        tooltipData[val.constantValue] = val.constantExpression;
      });
      this.setState({
        info: tooltipData
      }, () => this.props.reset_helpertext());
    }
  }

  loaderHandler = (param) => {
    this.setState({
      loaderPN: param
    });
  }

  handleCarriers = (e) => {
    const carrierRequired = getValueFromCustomAttribute(e, "data-validation");
    this.setState({
      carrier: e.target.value,
      carrierIsRequired: carrierRequired
    });
  }

  render() {
    this.responseHelptext();
    this.getPartNumberResponse();
    this.setEditForm();
    var receivingClosed = { state: this.state.receivingClosed };
    const setDiscrepancy = label => ({
      content: label.text
    });
    return (
      <div>
        <Loader fullpage loading={this.props.stateReciept.loader} />
        <ToastContainer />
        {/* <PrintDocument documentUrl={"https://extron-documents.s3-us-west-1.amazonaws.com/receiving-documents-print/noclient/receivingtag_192_20190728520_636991387687247976.pdf"} /> */}
        {this.showConfirmBox()}
        {this.saveReceiptResponse()}
        {this.redirectTo()}
        <div className="page-title">
          <div className="row">
            <div className="col-sm-6">
              <h6 className="mb-0">{CONSTANTS_RECEIVING.PAGE}</h6>
              <button
                style={{ marginBottom: "2%" }}
                type="button"
                className="btn btn-primary mt-3"
                onClick={() => {
                  this.setState({ redirectState: true });
                }}
              >
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
                &nbsp;&nbsp;{CONSTANTS.GENERIC.BUTTONS.RECEIVING_LIST}
              </button>
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
                    Add Receiving
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
        {/* Error Message Logs */}
        {this.errorLogs()}
        {this.errorListForPN()}
        {this.receivingIsClosed()}
        <form>
          {/* Get the Footer Buttons */}
          {/* {this.getFooterButton()} */}
          <Card className="card-statistics">
            <CardBody>
              <div className="form-row">
                <div className="form-group col-md-12">
                  <h6 className="float-left font-weight-bold">
                    {CONSTANTS_RECEIVING.TAG} #:  {this.state.tagNumber} {this.tagNumberView()}
                  </h6>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-3">
                  <label>
                    {CONSTANTS_RECEIVING.CLIENT}
                    <i
                      className={
                        "fa fa-info-circle ml-1 float-right mt-1 " +
                        (this.state.isTooltipEnable ? "d-block" : "d-none")
                      }
                      aria-hidden="true"
                      data-tip
                      data-for="tt_client"
                    />
                    <ReactTooltip id="tt_client" type="dark" effect="solid">
                      <span className="tooltip-ts">
                        {this.state.info.tt_client}
                      </span>
                    </ReactTooltip>
                  </label>
                </div>
                <div className="form-group col-md-3">
                  <ApolloProvider client={this.client}>
                    <select
                      className="form-control"
                      id="client"
                      name="client"
                      onChange={this.clientSelection}
                      value={this.state.client}
                      disabled={this.state.receiptStatus}
                    >
                      <option value="none" key={"none"}>Select Client</option>
                      {/* <Client param={this.props.stateOfZone.zone}/> */}
                      <Client />
                    </select>
                  </ApolloProvider>
                </div>
                <div className="col-md-1" />
                <div className="form-group col-md-2">
                  <label>
                    {CONSTANTS_RECEIVING.CONTAINER}
                    {/* <span className="text-danger">*</span> */}
                    <i
                      className={
                        "fa fa-info-circle ml-1 float-right mt-1 ml-1 " +
                        (this.state.isTooltipEnable ? "d-block" : "d-none")
                      }
                      aria-hidden="true"
                      data-tip
                      data-for="tt_container"
                    />
                    <ReactTooltip id="tt_container" type="dark" effect="solid">
                      <span className="tooltip-ts">
                        {this.state.info.tt_container}
                      </span>
                    </ReactTooltip>
                  </label>
                </div>
                <div className="form-group col-md-3 pt-2">
                  <ApolloProvider client={this.client}>
                    <select
                      className="form-control"
                      id="container"
                      name="container"
                      onChange={this.containerHandler}
                      value={this.state.container}
                      disabled={this.state.receiptStatus}
                    >
                      <option value="">Select Container</option>
                      <Containers containerType={this.state.container} />
                    </select>
                  </ApolloProvider>
                </div>
                {/* <div className="error">
                    {this.validator.message(
                      "Container",
                      this.state.container,
                      "requiredContainer"
                    )}
                  </div> */}
                {/* </div> */}
              </div>
              <div className="form-row">
                {/* <div className="form-group col-md-3">
                  <label>
                    {CONSTANTS_RECEIVING.ZONE}
                    <i
                      className={
                        "fa fa-info-circle ml-1 float-right mt-1 " +
                        (this.state.isTooltipEnable ? "d-block" : "d-none")
                      }
                      aria-hidden="true"
                      data-tip
                      data-for="tt_zone"
                    />
                    <ReactTooltip id="tt_zone" type="dark" effect="solid">
                      <span className="tooltip-ts">
                        {this.state.info.tt_zone}
                      </span>
                    </ReactTooltip>
                  </label>
                </div>
                <div className="form-group col-md-3">
                  <ApolloProvider client={this.client}>
                    <select
                      className="form-control"
                      id="zone"
                      name="zone"
                      onChange={this.handleChange}
                      value={this.state.zone}
                      disabled={
                        this.state.zoneState == "disabled" ||
                          this.state.receiptStatus == "disabled"
                          ? "disabled"
                          : ""
                      }
                    >
                      <option value="none">
                        {CONSTANTS_RECEIVING.SELECT_ZONE}
                      </option>
                      {this.state.client != "none" ? (
                        <FulfillmentZone param={this.state.client} />
                      ) : (
                          ""
                        )}
                    </select>
                  </ApolloProvider>
                  <div className="error">
                    {this.validator.message(
                      "Zone",
                      this.state.zone,
                      "zoneValidator:" + this.state.client
                    )}
                  </div>
                </div> */}
                <div className="form-group col-md-3">
                  <label>
                    {CONSTANTS_RECEIVING.CLIENT_POOL}
                    <i
                      className={
                        "fa fa-info-circle ml-1 float-right mt-1 " +
                        (this.state.isTooltipEnable ? "d-block" : "d-none")
                      }
                      aria-hidden="true"
                      data-tip
                      data-for="tt_client_pool"
                    />
                    <ReactTooltip
                      id="tt_client_pool"
                      type="dark"
                      effect="solid"
                    >
                      <span className="tooltip-ts">
                        {this.state.info.tt_client_pool}
                      </span>
                    </ReactTooltip>
                  </label>
                </div>
                <div className="form-group col-md-3">
                  <ApolloProvider client={this.client}>
                    <select
                      className="form-control"
                      id="pool"
                      name="pool"
                      value={this.state.pool}
                      onChange={this.handleChange}
                      disabled={
                        // this.state.fullfilmentState == "disabled" ||
                        this.state.receiptStatus == "disabled"
                          ? "disabled"
                          : ""
                      }
                    >
                      <option value="none">
                        {CONSTANTS_RECEIVING.SELECT_CLIENT_POOL}
                      </option>
                      {this.state.client != "none" && this.props.stateOfZone.zone != "none" ? (
                        <Pools clientId={this.state.client} zoneId={this.props.stateOfZone.zone} />
                      ) : (
                          ""
                        )}
                    </select>
                    <i>Note: Client and Zone need to select for Client Pool.</i>
                  </ApolloProvider>
                  {/* <div className="error">
                    {this.validator.message(
                      "Pool",
                      this.state.client,
                      "poolValidator:" + this.props.stateOfZone.zone
                    )}
                  </div> */}
                </div>
                <div className="col-md-1" />
                <div className="form-group col-md-2">
                  <label>
                    {CONSTANTS_RECEIVING.CARRIER}
                    <span className="text-danger">*</span>
                    <i
                      className={
                        "fa fa-info-circle ml-1 float-right mt-1 ml-1 " +
                        (this.state.isTooltipEnable ? "d-block" : "d-none")
                      }
                      aria-hidden="true"
                      data-tip
                      data-for="tt_carrier"
                    />
                    <ReactTooltip id="tt_carrier" type="dark" effect="solid">
                      <span className="tooltip-ts">
                        {this.state.info.tt_carrier}
                      </span>
                    </ReactTooltip>
                  </label>
                </div>
                <div className="form-group col-md-3">
                  <ApolloProvider client={this.client}>
                    <select
                      className="form-control"
                      id="carrier"
                      name="carrier"
                      // onChange={this.handleChange}
                      onChange={(e) => this.handleCarriers(e)}
                      value={this.state.carrier}
                      disabled={this.state.receiptStatus}
                    >
                      <option value="none">
                        {CONSTANTS_RECEIVING.SELECT_CARRIER}
                      </option>
                      <Carriers />
                    </select>
                  </ApolloProvider>
                  <div className="error">
                    {this.validator.message(
                      "Carrier",
                      this.state.carrier,
                      "carrierValidator"
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-3" />
                <div className="col-md-3">
                  <div className="form-check ml-1 mb-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="noPaperWork"
                      onChange={this.handleChange}
                      name="noPaperWork"
                      disabled={this.state.receiptStatus}
                      checked={this.state.packingState == "" ? "" : "checked"}
                    />
                    <label className="font-weight-bolder ml-1 checkbox-pt">
                      {CONSTANTS_RECEIVING.NO_PAPER_WORK}
                    </label>
                  </div>
                </div>
                <div className="col-md-1" />
                <div className="form-group col-md-2">
                  <label>
                    {CONSTANTS_RECEIVING.TRACKING_NUMBER}
                    <i
                      className={
                        "fa fa-info-circle ml-1 float-right mt-1 " +
                        (this.state.isTooltipEnable ? "d-block" : "d-none")
                      }
                      aria-hidden="true"
                      data-tip
                      data-for="tt_tracking_no"
                    />
                    <ReactTooltip
                      id="tt_tracking_no"
                      type="dark"
                      effect="solid"
                    >
                      <span className="tooltip-ts">
                        {this.state.info.tt_tracking_no}
                      </span>
                    </ReactTooltip>
                  </label>
                </div>
                <div className="form-group col-md-3">
                  <input
                    type="input"
                    className="form-control"
                    id="trackingNumber"
                    name="trackingNumber"
                    onChange={this.handleChange}
                    value={this.state.trackingNumber}
                    disabled={this.state.receiptStatus}
                    placeholder={CONSTANTS_RECEIVING.TRACKING_NUMBER}
                    maxLength="30"
                  />
                  <div className="error">
                    {this.validator.message(
                      "Tracking Number",
                      this.state.trackingNumber,
                      "trackingNumberCheck:"+ this.state.carrierIsRequired
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-3">
                  <label>
                    {CONSTANTS_RECEIVING.PACKING}
                    <i
                      className={
                        "fa fa-info-circle ml-1 float-right mt-1 " +
                        (this.state.isTooltipEnable ? "d-block" : "d-none")
                      }
                      aria-hidden="true"
                      data-tip
                      data-for="tt_packing_slip"
                    />
                    <ReactTooltip
                      id="tt_packing_slip"
                      type="dark"
                      effect="solid"
                    >
                      <span className="tooltip-ts">
                        {this.state.info.tt_packing_slip}
                      </span>
                    </ReactTooltip>
                  </label>
                </div>
                <div className="form-group col-md-3">
                  <input
                    type="input"
                    className="form-control"
                    id="packing"
                    name="packing"
                    onChange={this.handleChange}
                    value={this.state.packing}
                    disabled={
                      this.state.packingState ||
                        this.state.receiptStatus == "disabled"
                        ? "disable"
                        : ""
                    }
                    placeholder={CONSTANTS_RECEIVING.PACKING}
                    maxLength="30"
                  />
                  {/* <div className="error">
                    {this.validator.message(
                      "Packing",
                      this.state.packing,
                      "checkPaperworkStateValidator:" + this.state.packingState
                    )}
                  </div> */}
                </div>
                <div className="col-md-1" />
                <div className="form-group col-md-2">
                  <label>
                    {CONSTANTS_RECEIVING.RECEIVING_ON}
                    <span className="text-danger">*</span>
                    <i
                      className={
                        "fa fa-info-circle ml-1 float-right mt-1 ml-1 " +
                        (this.state.isTooltipEnable ? "d-block" : "d-none")
                      }
                      aria-hidden="true"
                      data-tip
                      data-for="tt_receive_on"
                    />
                    <ReactTooltip id="tt_receive_on" type="dark" effect="solid">
                      <p className="tooltip-ts">
                        {this.state.info.tt_receive_on}
                      </p>
                    </ReactTooltip>
                  </label>
                </div>
                <div className="form-group col-md-3">
                  <DatePicker
                    className="form-control"
                    selected={this.state.receivedOn}
                    onChange={this.selectedDateHandle}
                    disabled={
                      this.state.receiptStatus == "disabled" ? true : false
                    }
                    maxDate={new Date()}
                    minDate={this.minDate}
                  />
                  <i>
                    <small>{CONSTANTS.GENERIC.DATE_FORMAT}</small>
                  </i>
                  <div className="error">
                    {this.validator.message(
                      "Received On",
                      this.state.receivedOn,
                      "required:Received On"
                    )}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group col-md-3">
                  <label>
                    {CONSTANTS_RECEIVING.DISCREPENCY}
                    <i
                      className={
                        "fa fa-info-circle ml-1 float-right mt-1 " +
                        (this.state.isTooltipEnable ? "d-block" : "d-none")
                      }
                      aria-hidden="true"
                      data-tip
                      data-for="tt_discrepancy"
                    />
                    <ReactTooltip
                      id="tt_discrepancy"
                      type="dark"
                      effect="solid"
                    >
                      <p className="tooltip-ts">
                        {this.state.info.tt_discrepancy}
                      </p>
                    </ReactTooltip>
                  </label>
                </div>
                <div className="form-group col-md-3">
                  <Dropdown
                    placeholder={CONSTANTS_RECEIVING.DISCREPANCY}
                    fluid
                    multiple
                    selection
                    options={this.discrepancy}
                    onChange={this.selectDiscrepancy}
                    value={this.state.discrepancy}
                    disabled={this.state.receiptStatus}
                    style={{ fontFamily: "sans-serif" }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
          {/* Part Number view loaded */}
          <Card className="card-statistics mt-3 mb-3">
            <CardBody>
              <div>
                <LoadingOverlay className="mt-20">
                  {this.isActionAllowed(ACTIONS.RECIEVING.DOCK.GET_PARTS) &&
                    <PartNumber
                      buttonAlign="right"
                      getTheProps={this.state}
                      editPNPermission={true}
                      deletePNPermission={true}
                      printPNPermission={true}
                      {...receivingClosed}
                      partNumber={this.state.partNumber}
                      isFlag={this.state.pnflag}
                      onUpdate={this.onCallbackStateUpdate}
                      isFormValidCheck={this.showFormValidation}
                      callbackFromParent={this.myCallback}
                      handleLoader={this.loaderHandler}
                      actions={this.props.actions}
                    />
                  }
                  <Loader loading={this.state.loaderPN} />
                </LoadingOverlay>
              </div>

            </CardBody>
          </Card>

          <div className="form-row">
            <div className="col-md-6 mt-3">
              <PaperWork
                client={this.state.client}
                container={this.state.container}
                tagNumber={this.state.tagNumber}
                carrier={this.state.carrier}
                receivingId={this.state.receivingId}
                receiptStatus={this.state.receiptStatus}
                onChange={this.changeHandler}
                actions={this.props.actions}
              />
            </div>
            <div className="col-md-6 mt-3">
              <Pictures
                client={this.state.client}
                container={this.state.container}
                tagNumber={this.state.tagNumber}
                carrier={this.state.carrier}
                receivingId={this.state.receivingId}
                receiptStatus={this.state.receiptStatus}
                onChange={this.changeHandler}
                actions={this.props.actions}
              />
            </div>

          </div>

          {this.getFooterButton()}
        </form>
      </div >


    );
  }


  getFooterButton = () => {
    return (
      <div className="buttonContainer form-row float-right" style={{ paddingBottom: 30 }}>

        {this.isActionAllowed(ACTION.CLOSE_RECEIPT) &&
          <button
            type="button"
            className="btn btn-secondary mt-3 ml-2"
            onClick={this.closeReceiver}
            disabled={(this.state.receiptStatus == "disabled" || this.state.receivingId == 0) ? "disabled" : ""}
          >
            {CONSTANTS.GENERIC.BUTTONS.CLOSE_RECEIVER}
          </button>
        }
        {this.isActionAllowed(ACTION.SAVE_RECEIPT) &&

          <button
            type="button"
            className="btn btn-success ml-2 mt-3"
            onClick={this.sendReceiver}
            disabled={this.state.receiptStatus}
          >
            {CONSTANTS.GENERIC.BUTTONS.SAVE_RECEIVER}
          </button>
        }
      </div>
    )
  }
}


const mapDispatchToProps = {
  close_receiving: close_receiving,
  create_receiving: create_receiving,
  reset_action: reset_action,
  edit_reciept_reset: edit_reciept_reset,
  currentRoute: currentRoute,
  fetch_helpertext: fetch_helptext,
  reset_helpertext: reset_helpertext,
  print_tag_receipt,
  reset_print_tag_receipt
};

const mapStateToProps = state => {
  return {
    stateOfAction: state.user,
    stateOfReceiving: state.create_receiving,
    stateOfPN: state.add_partnumber,
    stateOfClose: state.close_receiving,
    stateReciept: state.edit_receiving,
    stateOfGenerics: state.reducer_state,
    stateOfTagReceipt: state.tag_receipt_reducer,
    permittedPages: state.getPermittedPagesReducer.permittedPages,
    stateOfZone: state.storeZoneReducer
  };
};

ReceivingAtDock = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceivingAtDock);

export default ReceivingAtDock;
