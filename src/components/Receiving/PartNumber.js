import React from "react";
import {
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  Alert
} from "reactstrap";
import SimpleReactValidator from "simple-react-validator";
import ReactTable from "react-table";
import ReceivingPackage from "../Elements/receivingPackage";
import StorageUnits from "../Elements/storage_units";
import { ApolloProvider } from "react-apollo";
import endpoint from "../../config/endpoints";
import {
  add_partnumber,
  reset_action,
  check_part_m2m,
  reset_part_num
} from "../../reduxUtils/actions/receiving";
import { connect } from "react-redux";
import CONSTANTS_IMPORT from "../../config/constants.json";
const CONSTANTS = CONSTANTS_IMPORT.PART_NUMBER;
import { getPartNumberList, deletePartNumber } from "../../services/Receiving";
import "./PartNumber.scss";
import swal from "sweetalert";
import ExtronTable from "../Elements/ExtronTable";
import { apolloClientGraphQL, printDocumentPopUp } from "../../utils/HelperFunctions";
import { ToastContainer, toast } from "react-toastify";
import { print_part_number, reset_print_part_number } from "../../reduxUtils/actions/printActions";
import ACTIONS from "../../config/ActionList.json";


class PartNumber extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // partNumber: props.addPartNumber,
      partNumber: this.props.partNumber,
      edit: props.editPNPermission,
      delete: props.deletePNPermission,
      print: props.printPNPermission,
      receivingClosed: props.receivingClosed,
      buttonAlign: props.buttonAlign == "right" ? "float-right" : "float-left",
      currentEditId: "",
      currentDeleteId: "",
      currentPrintId: "",
      modal: false,
      ex: "",
      pqty: "",
      qty: "",
      receiving: "",
      ex: "",
      lot: "",
      part: "",
      printPart: false,
      partQty: 5,
      labelToPrint: 10,
      rev: "",
      pnNotFound: "",
      authToken: this.props.stateOfAction.authToken,
      formSubmitted: false,
      pNumberColumns: [],
      pqtyType: "none",
      qtyType: "none",
      receivingId: 0,
      tagNumber: "",
      idReceivingDetail: 0,
      saveAndClose: false,
      m2mErrors: [],
      clientError: false,
      inspectionValue: "Receiving",
      lotRequired: false,
      showUOM: false,
      loader: false
    };

    this.tagNumber = "";
    this.idReceivingDetail = 0;
    this.printPartvalidator = new SimpleReactValidator();
  }

  isActionAllowed = (actionName = "") => { 
    return this.props.actions.indexOf(actionName);
  }


  initValidation = () => {
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
        queryFloatValidation: {
          message: ":field must be an integer, or after decimal add digit.",
          rule: (val, params, validator) => {
            var reg = /^-?\d*(\.\d+)?$/;
            return reg.test(val);
          },
          messageReplace: (message, params) =>
            message.replace(
              ":field",
              this.validator.helpers.toSentence(params)
            ),
          required: true
        },
        integer: {
          message: ":field must be an integer",
          rule: (val, params, validator) => {
            var reg = /^\d+$/;
            return reg.test(val);
          },
          messageReplace: (message, params) =>
            message.replace(
              ":field",
              this.validator.helpers.toSentence(params)
            ),
          required: true
        },
        boxesPallets2: {
          message: "Select UOM",
          rule: val => {
            if (val == "none") {
              return false;
            }
          },
          required: true
        },

        boxesPallets: {
          message: "Select Boxes/Pallets",
          rule: val => {
            if (val == "none") {
              return false;
            }
          },
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
  }

  loadExtronTable = () => {
    return (
      <ExtronTable
        parentRecords={this.state.partNumber}
        parentColumns={this.state.pNumberColumns}
        defaultSorted={[{ partNumber: "ReceivedOn", desc: true }]}
        filterable={true}
        minRows={0}
        defaultPageSize={10}
        showPaginationBottom={true}
        showPaginationTop={false}
        classes="-striped -highlight"
      />
    );
  };

  printPartLabel = e => {
    if (this.printPartvalidator.allValid()) {
      this.setState({
        printPart: !this.state.printPart
      });
    } else {
      this.printPartvalidator.showMessages();
      this.forceUpdate();
    }
  };

  toggle = e => {
    this.initValidation();
    this.setState({
      modal: !this.state.modal
    });
  };

  addPartNumber = (saveAndClose = null) => {
    if (this.validator.allValid()) {
      this.setState(
        {
          formSubmitted: true,
          receivingId: this.props.getTheProps.receivingId,
          tagNumber: this.props.getTheProps.tagNumber,
          receivedOn: this.props.getTheProps.receivedOn,
          trackingNumber: this.props.getTheProps.trackingNumber,
          carrier: this.props.getTheProps.carrier,
          container: this.props.getTheProps.container,
          zone: this.props.getTheProps.zone,
          client: this.props.getTheProps.client,
          packing: this.props.getTheProps.packing,
          discrepancy: this.props.getTheProps.discrepancy,
          pool: this.props.getTheProps.pool,
          saveAndClose: saveAndClose
        },
        () => {
          this.props.add_partnumber(this.state);
        }
      );
      // this.setState({
      //   modal: !this.state.modal  container: (this.state.container == "0") ? "3" : this.state.container
      // });
    } else {
      this.setState({
        formSubmitted: false
      });
      this.validator.showMessages();
      this.forceUpdate();
    }
  };

  rowFormat = (cell, row) => {
    return (
      <div>
        {(this.state.edit && this.isActionAllowed(ACTIONS.RECIEVING.DOCK.DELETE_PARTS) ) ? this.editIcon(row) : ""}{" "}
        {this.state.print ? this.printIcon(row) : ""}{" "}        
        {(this.state.delete && this.isActionAllowed(ACTIONS.RECIEVING.DOCK.DELETE_PARTS) ) ? this.deleteIcon(row) : ""}
      </div>
    );
  };

  performActionOnDelete = async partId => {
    let results = await deletePartNumber({
      authToken: this.state.authToken,
      partsId: partId
    });
    if (results.data.status == 200) {
      this.getPartNumberListRefresh();
      toast.success(CONSTANTS.PART_DELETED_SUCCESS, {});
    }

    if (results.data.status == 400) {
      this.getPartNumberListRefresh();
      swal("Error!", CONSTANTS.PART_DELETED_ERROR, "error");
    }
  };

  deleteIcon = data => {
    return (
      <i
        style={{cursor:"pointer"}}
        className="fa-lg fa fa-trash m-1"
        onClick={() => {
          this.props.getTheProps.receiptStatus != "disabled"
            ? swal({
              title: CONSTANTS.DELETE_HEAD,
              text: CONSTANTS.DELETE_INFO,
              icon: "warning",
              buttons: [CONSTANTS.CANCEL_BTN, CONSTANTS.YES],
              dangerMode: true
            }).then(willDelete => {
              if (willDelete) {
                this.performActionOnDelete(data.idReceivingDetail);
              }
            })
            : "";
        }}
      />
    );
  };

  editIcon = data => {
    return (
      <i
        style={{cursor:"pointer"}}
        className="fa-lg fa fa-edit m-1"
        onClick={() => {
          this.props.getTheProps.receiptStatus != "disabled"
            ? this.stateSetupOnEdit(data)
            : "";
        }}
      />
    );
  };

  stateSetupOnEdit = data => {
    this.setState({
      part: data.incomingPartNumber,
      rev: data.incomingRevisionNumber,
      qty: data.qtyReceived,
      qtyType: data.qtyUom,
      pqty: data.packageQtyReceived,
      pqtyType: parseInt(data.idPackageSize),
      lot: data.lotNumber,
      ex: data.binNumber,
      idReceivingDetail: data.idReceivingDetail,
      modal: !this.state.modal,
      pnNotFound: data.isAvailableInErp == false ? "checked" : "",
      showUOM: data.isAvailableInErp == true ? true : false
    });
  };

  printIcon = data => {
    return (
      <i 
        style={{cursor:"pointer"}}
        className="fa-lg fa fa-print m-1"
        // onClick={() => (this.props.getTheProps.receiptStatus != "disabled") ? this.onPrintPart(data) : ""} TODO
        onClick={() => this.onPrintPart(data)}
      ></i>
    );
  };

  onPrintPart = (data) => {
    this.setState({
      part: data.incomingPartNumber,
      // printPart: !this.state.printPart
    }, () => this.props.print_part_number(this.state));
  }

  handleChange = event => {
    event.persist();
    this.setState(
      {
        [event.target.id]: event.target.value,
        clientCode: this.props.getTheProps.clientCode
      },
      () => {
        this.checkM2M(event);
      }
    );
  };

  checkM2M = event => {
    if (event.target.name == "part" || event.target.name == "rev") {
      if (event.target.value != "" && this.state.part != "") {
        this.setState({ loader: true });
        this.props.check_part_m2m(this.state);
      }
    }
  };

  printPartToggle = () => {
    this.setState({
      printPart: !this.state.printPart
    });
  };

  partNumberCheckboxFn = e => {
    if (e.target.checked) {
      this.setState({
        pnNotFound: "checked"
      });
    } else {
      this.setState({
        pnNotFound: ""
      });
    }
  };

  checkStatus = e => {
    switch (this.props.stateOfPN.status) {
      case 200:
        // swal("Success", CONSTANTS.PART_CREATED, "success");
        toast.success(CONSTANTS.PART_CREATED, {});
        this.props.reset_action();
        this.setState({
          ex: "",
          part: "",
          rev: "",
          qty: "",
          qtyType: "none",
          pqty: "",
          pqtyType: "none",
          lot: "",
          receiving: "",
          formSubmitted: false,
          idReceivingDetail: 0,
          pnNotFound: "",
          showUOM: false,
          inspectionValue: "Receiving"
        });
        // close if save only
        if (this.state.saveAndClose) {
          this.toggle();
          this.setState({ saveAndClose: false });
        }
        this.initValidation();
        break;
        // case 400:
        // TODO - for future work
        //   swal("Error", CONSTANTS.PART_UNABLE_TO_CREATE, "error");
        //   this.props.reset_action();
        //   this.setState({
        //     ex: "",
        //     part: "",
        //     rev: "",
        //     qty: "",
        //     qtyType: "none",
        //     pqty: "",
        //     pqtyType: "none",
        //     lot: "",
        //     receiving: "",
        //     formSubmitted: false,
        //     idReceivingDetail: 0,
        //     pnNotFound: ""
        //   });
        // this.props.reset_action();
        // this.toggle();
        break;
      default:
        break;
    }
  };

  resetFormFields = () => {
    this.props.reset_action();
    this.setState({
      ex: "",
      part: "",
      rev: "",
      qty: "",
      qtyType: "none",
      pqty: "",
      pqtyType: "none",
      lot: "",
      receiving: "",
      formSubmitted: false,
      idReceivingDetail: 0
    });
    this.toggle();
  };

  onRowClick = (state, rowInfo, column, instance) => {
    return {
      onClick: e => {
        // TODO - For debugging
        // console.log('A Td Element was clicked!')
        // console.log('it produced this event:', e)
        // console.log('It was in this column:', column)
        // console.log('It was in this row:', rowInfo.original)
        // console.log('It was in this table instance:', instance)
      }
    };
  };

  componentWillMount() {
    this.client = apolloClientGraphQL(endpoint.GRAPHQL_URL);
    this.initValidation();

    this.setState({
      pNumberColumns: [
        {
          Header: "Part #",
          id: "incomingPartNumber",
          sortable: true,
          accessor: d => d.incomingPartNumber
        },
        {
          Header: "Rev #",
          id: "incomingRevisionNumber",
          sortable: true,
          accessor: d => d.incomingRevisionNumber
        },
        {
          Header: "Qty Received",
          id: "qtyReceived",
          sortable: true,
          width: 90,
          accessor: d => {
            const unit = (d.qtyUom == "none" || d.qtyUom == null) ? "" : d.qtyUom;
            return d.qtyReceived + " " + unit;
          }
        },
        {
          Header: "Boxes",
          id: "boxes",
          sortable: true,
          width: 90,
          accessor: d => {
            return d.packageSize == "BOX" || d.packageSize == "Box"
              ? d.packageQtyReceived
              : 0;
          }
        },
        {
          Header: "Pallets",
          id: "pallets",
          sortable: true,
          width: 90,
          accessor: d => {
            return d.packageSize == "PALLET" || d.packageSize == "Pallet"
              ? d.packageQtyReceived
              : 0;
          }
        },
        {
          Header: "Lot #",
          id: "lotNumber",
          sortable: true,
          accessor: d => d.lotNumber
        },
        {
          Header: "Actions",
          id: "checkbox",
          accessor: "",
          width: 210,
          Filter: ({ filter, onChange }) => <input type="text" disabled />,
          sortable: false,
          Cell: ({ original }) => {
            // var d = original.map((data)=>{
            // });
            return (
              <div>
                  {this.state.edit ? this.editIcon(original) : ""}{" "}
                {this.state.print ? this.printIcon(original) : ""}{" "}
                {(this.state.delete && this.isActionAllowed(ACTIONS.RECIEVING.DOCK.DELETE_PARTS) ) ? this.deleteIcon(original) : ""}
              </div>
            );
          }
        }
      ]
    });


  }

  getPartNumberListRefresh = async () => {
    let results = await getPartNumberList({
      authToken: this.state.authToken,
      receivingid: this.props.getTheProps.receivingId
    });
    if (results.data.data == null) {
      this.setState({
        partNumber: []
      });
    } else {
      this.setState({
        partNumber: results.data.data
      });
      this.props.onUpdate(false);
    }
  };

  getPartNumberList = async () => {
    if (this.props.stateOfPN.status == 200) {
      let results = await getPartNumberList({
        authToken: this.state.authToken,
        receivingid:
          this.props.stateOfPN.data != null
            ? this.props.stateOfPN.data.receivingid
            : this.props.getTheProps.receivingId
      });
      this.setState({
        partNumber: results.data.data
      });
      this.props.onUpdate(false);
    }
  };

  checkPNFlag = () => {
    if (
      this.props.partNumber != null &&
      Object.keys(this.props.partNumber).length > 0
    ) {
      this.setState({
        partNumber: this.props.partNumber
      });
      this.props.onUpdate(false);
    }
  };

  mandatoryFieldsMessagePopup = () => {
    return swal("Please select Carrier");
  };

  setStateInspection = () => {
    let data = this.props.check_part.data;
    let inspectionValue = (data && data.requiresInspectionCheckbox) ? "Inspection" :  "Receiving"; 
    this.lotRequired = (data && data.lotRequired) ? true : false;
    let qtyType = (data && data.um) ? data.um : "";
    this.setState({
      pnNotFound: "",
      inspectionValue,
      qtyType,
      showUOM: true
    });
  };

  checkM2MStatus = () => {
    switch (this.props.check_part.status) {
      case 200:
        this.setStateInspection();
        this.props.reset_part_num();
        this.setState({ clientError: false, loader: false });
        break;
      case 400:
      case 401:
        this.setState({ pnNotFound: "checked" });
        this.setState({ clientError: true, loader: false });
        this.props.reset_part_num();
        break;
      case 404:
        this.setState({ pnNotFound: "checked", loader: false, showUOM: false, inspectionValue: "Receiving" });
        this.props.reset_part_num();
        break;
      default:
    }
  };

  onDismiss = () => {
    this.setState({ clientError: false });
  };

  render() {    
    // part number init checker
    if (this.props.isFlag) {
      this.checkPNFlag();
    }

    this.checkM2MStatus();
    this.checkStatus();
    this.getPartNumberList();
    return (
      <div>
        <div className="form-row">
          <ToastContainer />
          <div className="form-group col-md-12">
            <div className="addPartHeading">              
              <h6>Add Part Number</h6> 
            </div>

            {this.isActionAllowed(ACTIONS.RECIEVING.DOCK.ADD_PARTS) && <button
              type="button"
              className={"btn btn-primary " + this.state.buttonAlign}
              onClick={() =>
                this.props.getTheProps.carrier == "none"
                  ? this.mandatoryFieldsMessagePopup()
                  : this.toggle()
              }
              disabled={this.props.getTheProps.receiptStatus}
            >
              {CONSTANTS.ADD_PN_BTN}
            </button>
            }
          </div>
        </div>
        <Modal isOpen={this.state.printPart} toggle={this.printPartToggle}>
          <ModalHeader toggle={this.printPartToggle}>
            {CONSTANTS.PN_MODAL_HEADER}
          </ModalHeader>
          <ModalBody>
            <div className="form-row">
              <label className="col-md-3 col-form-label">
                {CONSTANTS.PRINT_PART_QTY}
              </label>
              <div className="form-group col-md-9">
                <input
                  type="text"
                  name="partQty"
                  className="form-control"
                  id="partQty"
                  value={this.state.partQty}
                  onChange={event => this.handleChange(event)}
                />
                <div className="error">
                  {this.printPartvalidator.message(
                    "Part Qty",
                    this.state.partQty,
                    "required|numeric"
                  )}
                </div>
              </div>
            </div>
            <div className="form-row">
              <label className="col-md-3 col-form-label">
                {CONSTANTS.PRINT_LABEL}
              </label>
              <div className="form-group col-md-9">
                <input
                  type="text"
                  name="labelToPrint"
                  className="form-control"
                  id="labelToPrint"
                  value={this.state.labelToPrint}
                  onChange={event => this.handleChange(event)}
                />
                <div className="error">
                  {this.printPartvalidator.message(
                    "Labels To Print",
                    this.state.labelToPrint,
                    "required|numeric"
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter >
            <Button color="primary" onClick={this.printPartLabel}>
              {CONSTANTS.PRINT_BTN}
            </Button>{" "}
            <Button color="secondary" onClick={this.printPartToggle}>
              {CONSTANTS.CANCEL_BTN}
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className="modal-lg"
        >
          <ModalHeader toggle={this.resetFormFields}>
            {this.state.idReceivingDetail == 0
              ? CONSTANTS.HEAD_PN
              : CONSTANTS.HEAD_PN_EDIT}
          </ModalHeader>
          <ModalBody>
            <Alert
              color="warning"
              isOpen={this.state.clientError}
              toggle={this.onDismiss}
            >
              M2M Failed to respond
            </Alert>
            <div className="form-row">
              <div className="form-check mb-3 ml-1">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={this.state.pnNotFound}
                  onChange={this.partNumberCheckboxFn}
                  name="pnNotFound"
                  id="pnNotFound"
                  disabled
                />
                <label className="form-check-label ml-1">
                  {CONSTANTS.LABEL_PN_NOT_FOUNT}
                </label>
              </div>
            </div>
            <div className="form-row">
              <label className="col-md-3 col-form-label">
                {CONSTANTS.PART}
              </label>
              <div className="form-group col-md-5">
                <input
                  type="text"
                  name="part"
                  className="form-control"
                  id="part"
                  value={this.state.part}
                  placeholder={CONSTANTS.PART_PH}
                  onChange={event => this.handleChange(event)}
                />
                <div className="error">
                  {this.validator.message(
                    "Part #",
                    this.state.part,
                    "required:Part#"
                  )}
                </div>
              </div>
              <div className="form-group col-md-4">
                <input
                  type="text"
                  name="rev"
                  id="rev"
                  className="form-control"
                  placeholder={CONSTANTS.REV}
                  onChange={event => this.handleChange(event)}
                  value={this.state.rev}
                />
                {
                  <div className="error">
                    {this.validator.message("Rev #", this.state.rev, "max:3")}
                  </div>
                }
              </div>
            </div>
            <div className="form-row">
              <label className="col-md-3 col-form-label">
                {CONSTANTS.QTY_RECEIVED}
              </label>
              <div className="form-group col-md-5">
                <input
                  type="number"
                  name="qty"
                  className="form-control"
                  id="qty"
                  placeholder={CONSTANTS.QTY_RECEIVED_PH}
                  onChange={event => this.handleChange(event)}
                  value={this.state.qty}
                />
                <div className="error">
                  {this.validator.message(
                    "Quantity",
                    this.state.qty,
                    "required:Quantity|integer:Quantity|queryFloatValidation:Quantity"
                  )}
                </div>
              </div>
              {this.state.showUOM && (
                <div className="form-group col-md-4">
                  <ApolloProvider client={this.client}>
                    <select
                      className="form-control"
                      id="qtyType"
                      name="qtyType"
                      onChange={event => this.handleChange(event)}
                      value={this.state.qtyType}
                      disabled
                    >
                      <option value={this.state.qtyType}>
                        {this.state.qtyType}
                      </option>
                      {/* <StorageUnits /> */}
                    </select>
                  </ApolloProvider>
                  <div className="error">
                    {this.validator.message(
                      "Quantity2",
                      this.state.qtyType,
                      "boxesPallets2"
                    )}
                  </div>
                </div>
              )}
              {/* <div className="form-group col-md-2">
                    <span><small>Will be posted in <b>M2M QOH</b></small></span>
                  </div> */}
            </div>
            <div className="form-row">
              <label className="col-md-3 col-form-label">
                {CONSTANTS.B_P_RECEIVED}
              </label>
              <div className="form-group col-md-5">
                <input
                  type="number"
                  name="pqty"
                  pattern="\d+"
                  className="form-control"
                  id="pqty"
                  placeholder={CONSTANTS.B_P_RECEIVED_PH}
                  onChange={event => this.handleChange(event)}
                  value={this.state.pqty}
                />
                <div className="error">
                  {this.validator.message(
                    "Quantity",
                    this.state.pqty,
                    "required:Boxes/Palletes|integer:Boxes/Palletes"
                  )}
                </div>
              </div>
              <div className="form-group col-md-4">
                <ApolloProvider client={this.client}>
                  <select
                    className="form-control"
                    id="pqtyType"
                    name="pqtyType"
                    value={this.state.pqtyType}
                    onChange={event => this.handleChange(event)}
                  >
                    <option value="none">Select Boxes/Pallets</option>
                    <ReceivingPackage />
                  </select>
                </ApolloProvider>
                <div className="error">
                  {this.validator.message(
                    "Quantity",
                    this.state.pqtyType,
                    "boxesPallets"
                  )}
                </div>
              </div>
            </div>
            <div className="form-row">
              <label className="col-md-3 col-form-label">{CONSTANTS.LOT}</label>
              <div className="form-group col-md-5">
                <input
                  type="text"
                  name="lot"
                  className="form-control"
                  id="lot"
                  placeholder={CONSTANTS.LOT}
                  onChange={event => this.handleChange(event)}
                  value={this.state.lot}
                />
                <div className="error">
                  {this.state.lotRequired &&
                    this.validator.message(
                      "Lot",
                      this.state.lot,
                      "required:Lot"
                    )}
                </div>
              </div>
            </div>
            <div className="form-row">
              <label className="col-md-3 col-form-label">{CONSTANTS.BIN}</label>
              <div className="form-group col-md-3">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">EX-</InputGroupAddon>
                  <Input
                    className="form-control"
                    placeholder="username"
                    name="ex"
                    id="ex"
                    placeholder={CONSTANTS.BIN_PH}
                    onChange={event => this.handleChange(event)}
                    value={this.state.inspectionValue}
                  />
                </InputGroup>
                {/* <input type="text" className="form-control" /> */}
                {/* <div className="error">
                    {this.validator.message(
                      "Ex",
                      this.state.ex,
                      "required:Bin Number"
                    )}
                  </div> */}
              </div>
              {/* <div className="form-group col-md-2">
                <input
                  type="text"
                  className="form-control"
                  value={this.state.inspectionValue}
                  disabled
                /> */}

              {/* <div className="error">
                    {this.validator.message(
                      "Ex",
                      this.state.ex,
                      "required:Bin Number"
                    )}
                  </div> */}
              {/* </div> */}
              {/* <div className="form-group col-md-2"> */}
              {/* <input type="text" name="receiving" className="form-control" id="receiving" placeholder={CONSTANTS.BIN_RECEIVING_PH} onChange={(event) => this.handleChange(event)} value={this.state.receiving} /> */}
              {/* <div className="error">
                    {this.validator.message(
                      "Receiving",
                      this.state.receiving,
                      "required:Bin Receiving"
                    )}
                  </div> */}
              {/* </div> */}
            </div>
          </ModalBody>
          <ModalFooter  >
            {this.state.loader && <span>Please wait...</span>}
            <span className={this.state.loader ? "fadeOut" : undefined}>
              <Button color="primary" onClick={() => this.addPartNumber()}>
                Save and Continue
            </Button> &nbsp;
              <Button color="secondary" onClick={() => this.addPartNumber(true)}>
                Save and Close
            </Button>
            </span>
            {/* <Button color="secondary" disabled={(this.state.formSubmitted) ? "disabled" : ""} onClick={this.resetFormFields}>{CONSTANTS.CANCEL_BTN}</Button> */}
          </ModalFooter>
        </Modal>
        {/* rendering datatable */
          this.state.partNumber && this.state.partNumber.length > 0
            ? this.loadExtronTable()
            : this.noRecordsAvailableForPN()}
      </div>
    );
  }

  noRecordsAvailableForPN = () => {
    return (
      <div>
        <p className="text-center">{CONSTANTS.NO_PART_NUMBER}</p>
      </div>
    );
  };
}

const mapDispatchToProps = {
  add_partnumber: add_partnumber,
  reset_action: reset_action,
  print_part_number,
  reset_print_part_number,
  check_part_m2m,
  reset_part_num
};

const mapStateToProps = state => {
  return {
    stateOfAction: state.user,
    stateOfPN: state.add_partnumber,
    stateOfPartNumber: state.part_number_reducer,
    check_part: state.checkPartReducer
  };
};

PartNumber = connect(
  mapStateToProps,
  mapDispatchToProps
)(PartNumber);

export default PartNumber;
