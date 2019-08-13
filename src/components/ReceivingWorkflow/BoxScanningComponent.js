import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from 'reactstrap';
import { connect } from "react-redux";
import SimpleReactValidator from "simple-react-validator";
import { post_serials, reset_state_serial } from "../../reduxUtils/actions/workflow/taggedReceiving";
import "./BoxComponent.css";
import { ToastContainer, toast } from "react-toastify";
import CONSTANTS from "../../config/constants.json";
import { Card, CardBody } from "reactstrap";

class BoxScanningComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal1: false,
      stateDisabled: true,
      tempId1IsChecked: false,
      tempId2IsChecked: false,
      macIdIsChecked: false,
      softwareVerChecked: false,
      serialNumberIsChecked: false,
      assetIdCheck: false,
      formData: {
        SerialNumber: null,
        SoftwareVer: null,
        MacId: null,
        tempId1: null,
        tempId2: null,
        AssetId: null,
        containerId: props.parentState.currentBox,
        IdAssetDetail: 0,
        onSuccessSerialItem: false,
        palletId: null
      },
      authToken: this.props.stateOfAction.authToken,
      idReceiving: props.parentState.openedPN.idReceiving,
      tagNumber: props.parentState.openedPN.tagNumber,
      lotNumber: props.parentState.parts.lotNumber,
      qtyReceived: props.parentState.parts.qtyReceived,
      binNumber: props.parentState.parts.binNumber,
      mappedPartNumber: props.parentState.parts.mappedPartNumber,
      mappedRevisionNumber: props.parentState.parts.mappedRevisionNumber,
      partNumber: props.parentState.parts.partNumber,
      revisionNumber: props.parentState.parts.revisionNumber,
      idReceivingDetail: props.parentState.parts.idReceivingDetail,
      actionType: "save",
      quantityLeft: props.parentState.parts.scanLeft,
      serialStart: 1,
      serialEnd: 0,
      groupOfSerials: props.parentState.itemsPerBoxes == null ? props.parentState.parts.scanSerialNumber : props.parentState.itemsPerBoxes,
      totalContainers: props.parentState.totalContainers,
      containerId: props.parentState.currentBox,
      palleteId: null,
      alertErrorOnSN: false,
      boxIdDisabled: false,
      paletteIdDisabled: false,
      showScanSection: props.parentState.showScanSection,
      totalQuantity: props.parentState.totalQuantity
    }
    this.baseState = this.state;
    this.initValidation();
    this.form = "";
  }

  initValidation = () => {
    this.validator = new SimpleReactValidator({
      validators: {
        required: {
          message: ":field is required",
          rule: (val, params, validator) => {
            return val != "";
          },
          messageReplace: (message, params) => message.replace(':field', this.validator.helpers.toSentence(params)),
          required: true
        }, validateIfValueExists: {
          message: "",
          rule: (val, params, validator) => {
            if (val != "") {
              return true;
            } else {
              return false;
            }
          },
          required: true
        }
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState((prevState) => ({
      idReceiving: nextProps.parentState.openedPN.idReceiving,
      tagNumber: nextProps.parentState.openedPN.tagNumber,
      lotNumber: nextProps.parentState.parts.lotNumber,
      qtyReceived: nextProps.parentState.parts.qtyReceived,
      binNumber: nextProps.parentState.parts.binNumber,
      mappedPartNumber: nextProps.parentState.parts.mappedPartNumber,
      mappedRevisionNumber: nextProps.parentState.parts.mappedRevisionNumber,
      partNumber: nextProps.parentState.parts.partNumber,
      revisionNumber: nextProps.parentState.parts.revisionNumber,
      idReceivingDetail: nextProps.parentState.parts.idReceivingDetail,
      // quantityLeft: nextProps.parentState.parts.scanLeft,
      groupOfSerials: nextProps.parentState.itemsPerBoxes == null ? nextProps.parentState.parts.scanSerialNumber : nextProps.parentState.itemsPerBoxes,
      totalContainers: nextProps.parentState.totalContainers,
      showScanSection: nextProps.parentState.showScanSection,
      totalQuantity: nextProps.parentState.totalQuantity,
      formData: {
        containerId: prevState.boxIdDisabled ? this.state.formData.containerId : nextProps.parentState.currentBox,
        SerialNumber: prevState.formData.SerialNumber,
        SoftwareVer: prevState.formData.SoftwareVer,
        MacId: prevState.formData.MacId,
        tempId1: prevState.formData.tempId1,
        tempId2: prevState.formData.tempId2,
        AssetId: prevState.formData.AssetId,
        IdAssetDetail: 0,
        palletId: prevState.formData.palletId
      }
    }));
  }


  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  togglePaletteId = () => {
    this.setState(prevState => ({
      paletteIdDisabled: !prevState.paletteIdDisabled
    }));
  }

  toggleBoxId = () => {
    this.setState(prevState => ({
      boxIdDisabled: !prevState.boxIdDisabled
    }));
  }

  componentWillMount() {
    this.props.reset_action();
  }

  togglenested = () => {
    this.setState(prevState => ({
      modal1: !prevState.modal1
    }));
  }

  postSerialList = () => {
    if (this.validator.allValid()) {
      this.props.post_serials(this.state);
    } else {
      this.validator.showMessages();
      this.forceUpdate();
    }
  }

  handleChangeEvent = (myState, e) => {
    var states = this.state.formData;
    states[myState] = e.target.value;
    this.setState({
      [states]: e.target.value
    })
  }

  timeoutAlert = () => {
    setTimeout(() => {
      this.setState({
        onSuccessSerialItem: false
      })
    }, 2000);
    return (
      <div className="col-md-12">
        <Alert color="success">
          Serial # added Successfully
        </Alert>
      </div>
    )
  }
  serialItemsResponse = () => {
    if (this.props.stateOfSerialItems.status == 200) {
      // toast.success("Serial # added Successfully", {});
      this.setState({
        onSuccessSerialItem: true
      });

      // check if serials are scanned in a single box is done Eg: quantityLeft=0
      if (this.props.stateOfSerialItems.data.quantityLeft == 0) {
        this.initValidation();
        this.setState((prevState) => ({
          serialStart: 1,
          quantityLeft: this.props.stateOfSerialItems.data.quantityLeft,
          formData: {
            SerialNumber: this.state.serialNumberIsChecked ? prevState.formData.SerialNumber : "",
            SoftwareVer: this.state.softwareVerChecked ? prevState.formData.SoftwareVer : "",
            MacId: this.state.macIdIsChecked ? prevState.formData.MacId : "",
            tempId1: this.state.tempId1IsChecked ? prevState.formData.tempId1 : "",
            tempId2: this.state.tempId2IsChecked ? prevState.formData.tempId2 : "",
            AssetId: "",
            palletId: prevState.formData.palletId,
            containerId: this.state.formData.containerId,
            IdAssetDetail: 0
          },
          tempId2IsChecked: true,
          tempId1IsChecked: true,
          macIdIsChecked: true,
          softwareVerChecked: true,
          serialNumberIsChecked: true,
          assetIdCheck: true
        }));
      }

      // check if items are still pending in a box to be scanned Eg: quantityLeft!=0
      if (this.props.stateOfSerialItems.data.quantityLeft > 0) {
        this.initValidation();
        // If current serial state is running less than group of serials then perform action
        var serialStartState = (this.state.serialStart == this.state.groupOfSerials) ? 1 : this.state.serialStart + 1;
        this.setState((prevState) => ({
          quantityLeft: this.props.stateOfSerialItems.data.quantityLeft,
          serialStart: serialStartState,
          formData: {
            SerialNumber: this.state.serialNumberIsChecked ? prevState.formData.SerialNumber : "",
            SoftwareVer: this.state.softwareVerChecked ? prevState.formData.SoftwareVer : "",
            MacId: this.state.macIdIsChecked ? prevState.formData.MacId : "",
            tempId1: this.state.tempId1IsChecked ? prevState.formData.tempId1 : "",
            tempId2: this.state.tempId2IsChecked ? prevState.formData.tempId2 : "",
            AssetId: "",
            palletId: prevState.formData.palletId,
            containerId: this.state.formData.containerId,
            IdAssetDetail: 0
          }
        }));
      }

      // resetting the state of store
      this.props.reset_action();
    }
  }

  getRandomNumber = () => {
    this.setState({
      formData: {
        SerialNumber: this.state.formData.SerialNumber,
        SoftwareVer: this.state.formData.SoftwareVer,
        MacId: this.state.formData.MacId,
        tempId1: this.state.formData.tempId1,
        tempId2: this.state.formData.tempId2,
        AssetId: this.state.formData.AssetId,
        containerId: this.state.formData.containerId,
        IdAssetDetail: 0,
        palletId: Math.floor((Math.random() * 1000) + 1).toString()
      }
    })
  }

  alertErrorSN = () => {
    this.setState(prevState => ({
      alertErrorOnSN: !prevState.alertErrorOnSN
    }));
  }

  serialItemsLog = () => {
    if (this.props.stateOfSerialItems.status == 400) {
      var errorLogs = this.props.stateOfSerialItems.errors;
      var items = [];
      errorLogs.forEach((err, i) => {
        items.push(<li className="ml-2" key={i}>{err}</li>);
      });
      // this.props.reset_action();
      return (
        <div className="col-md-12">
          <Alert color="danger">
            {items}
          </Alert>
        </div>
      );
    }
  };

  checkboxHandler = () => {
    var { serialNumberIsChecked,
      softwareVerChecked,
      macIdIsChecked,
      tempId2IsChecked,
      tempId1IsChecked } = this.form;
    this.setState({
      serialNumberIsChecked: serialNumberIsChecked.checked,
      softwareVerChecked: softwareVerChecked.checked,
      tempId2IsChecked: tempId2IsChecked.checked,
      tempId1IsChecked: tempId1IsChecked.checked,
      macIdIsChecked: macIdIsChecked.checked
    });
  }

  quantityEmpty = () => {
    return (
      <div className="col-md-12">
        <Alert color="info">
          {CONSTANTS.RECEIVING_MASTER.QUANTITY_ZERO}
        </Alert>
      </div>
    );
  }

  serialNumberView = () => {
    return (
      <div>
        <Card>
          <CardBody>
            <div className="serial-table">
              <div className="table-header pb-2 d-inline-block w-100 border-bottom">
                <p className="d-inline-block">Serial # {this.state.serialStart} of {this.state.groupOfSerials}</p>
                <button type="button" disabled={this.state.quantityLeft == 0 ? true : false} className="btn btn-primary float-right" onClick={this.postSerialList}>Add S/N</button>
              </div>
              <div className="row mt-1">
                {this.serialItemsLog()}
                {this.state.onSuccessSerialItem && this.state.quantityLeft != 0 ? this.timeoutAlert() : ""}
                {this.state.quantityLeft == 0 ? this.quantityEmpty() : ""}
              </div>
              <div className="mt-1">
                <div className="form-row">
                  <div className="form-group col-md-5">
                    <label>Box ID: </label>
                  </div>
                  <div className="form-group col-md-6">
                    {/* <input type="text" className="form-control" id="box_id" name="box_id" value={this.state.containerId} disabled={this.state.boxIdDisabled} /> */}
                    <select className="form-control" onChange={(e) => this.onChangeContainerBoxValue(e)} disabled={this.state.boxIdDisabled} id="containerId" name="containerId">
                      {this.containerBox()}
                    </select>
                  </div>
                  <div className="form-group col-md-1">
                    <input type="checkbox" className="checkbox mt-3" onChange={this.toggleBoxId} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-5">
                    <label>Pallet ID:</label>
                  </div>
                  <div className="form-group col-md-5">
                    <input type="text" className="form-control" id="carrier" name="carrier" disabled={this.state.paletteIdDisabled} value={this.state.formData.palletId} />
                  </div>
                  <div className="form-group col-md-1">
                    <i
                      className="fa fa-plus fa-2x mt-1"
                      aria-hidden="true"
                      onClick={() => !this.state.paletteIdDisabled ? this.getRandomNumber() : ""}
                      disabled={this.state.paletteIdDisabled}>
                    </i>
                  </div>
                  <div className="form-group col-md-1">
                    <input type="checkbox" className="checkbox mt-3" onChange={this.togglePaletteId} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-5">
                    <label className="m-0">Serial#</label>
                  </div>
                  <div className="form-group col-md-6">
                    <input type="text" className="form-control" id="SerialNumber" name="SerialNumber" onChange={(e) => this.handleChangeEvent('SerialNumber', e)} value={this.state.formData.SerialNumber} disabled={this.state.serialNumberIsChecked} />
                    <div className="error mt-1">
                      {this.validator.message(
                        "SerialNumber",
                        this.state.formData.SerialNumber,
                        "required:Serial|validateIfValueExists:" + this.state.formData.SerialNumber
                      )}
                    </div>
                  </div>
                  <div className="form-group col-md-1">
                    <input
                      type="checkbox"
                      className="checkbox mt-2"
                      name="serialNumberIsChecked"
                      id="serialNumberIsChecked"
                      onChange={
                        () => this.checkboxHandler()
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-5">
                    <label className="m-0">Software Version</label>
                  </div>
                  <div className="form-group col-md-6">
                    <input type="text" className="form-control" id="SoftwareVer" name="SoftwareVer" onChange={(e) => this.handleChangeEvent('SoftwareVer', e)} value={this.state.formData.SoftwareVer} disabled={this.state.softwareVerChecked} />
                    <div className="error mt-1">
                      {this.validator.message(
                        "SoftwareVer",
                        this.state.formData.SoftwareVer,
                        "required:Software Version|validateIfValueExists:" + this.state.formData.SoftwareVer
                      )}
                    </div>
                  </div>
                  <div className="form-group col-md-1">
                    <input
                      type="checkbox"
                      className="checkbox mt-3"
                      name="softwareVerChecked"
                      id="softwareVerChecked"
                      onChange={
                        () => this.checkboxHandler()
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-5">
                    <label className="m-0">Mac ID</label>
                  </div>
                  <div className="form-group col-md-6">
                    <input type="text" className="form-control" id="MacId" name="MacId" onChange={(e) => this.handleChangeEvent('MacId', e)} value={this.state.formData.MacId} disabled={this.state.macIdIsChecked} />
                    <div className="error mt-1">
                      {this.validator.message(
                        "MacId",
                        this.state.formData.MacId,
                        "required:Mac ID|validateIfValueExists:" + this.state.formData.MacId
                      )}
                    </div>
                  </div>
                  <div className="form-group col-md-1">
                    <input
                      type="checkbox"
                      className="checkbox mt-3"
                      name="macIdIsChecked"
                      id="macIdIsChecked"
                      onChange={
                        () => this.checkboxHandler()
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-5">
                    <label className="m-0">Temp ID 1</label>
                  </div>
                  <div className="form-group col-md-6">
                    <input type="text" className="form-control" id="tempId1" name="tempId1" onChange={(e) => this.handleChangeEvent('tempId1', e)} value={this.state.formData.tempId1} disabled={this.state.tempId1IsChecked} />
                    <div className="error mt-1">
                      {this.validator.message(
                        "tempId1",
                        this.state.formData.tempId1,
                        "required:Temp ID|validateIfValueExists:" + this.state.formData.tempId1
                      )}
                    </div>
                  </div>
                  <div className="form-group col-md-1">
                    <input
                      type="checkbox"
                      className="checkbox mt-3"
                      name="tempId1IsChecked"
                      id="tempId1IsChecked"
                      onChange={
                        () => this.checkboxHandler()
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-5">
                    <label className="m-0">Temp ID 2</label>
                  </div>
                  <div className="form-group col-md-6">
                    <input type="text" className="form-control" id="tempId2" name="tempId2" onChange={(e) => this.handleChangeEvent('tempId2', e)} value={this.state.formData.tempId2} disabled={this.state.tempId2IsChecked} />
                    <div className="error mt-1">
                      {this.validator.message(
                        "tempId2",
                        this.state.formData.tempId2,
                        "required:Temp ID|validateIfValueExists:" + this.state.formData.tempId2
                      )}
                    </div>
                  </div>
                  <div className="form-group col-md-1">
                    <input
                      type="checkbox"
                      className="checkbox mt-3"
                      name="tempId2IsChecked"
                      id="tempId2IsChecked"
                      onChange={
                        () => this.checkboxHandler()
                      }
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-5">
                    <label className="m-0">Asset ID</label>
                  </div>
                  <div className="form-group col-md-6">
                    <input type="text" className="form-control" id="AssetId" name="AssetId" onChange={(e) => this.handleChangeEvent('AssetId', e)} value={this.state.formData.AssetId} disabled={this.state.assetIdCheck} />
                    <div className="error mt-1">
                      {this.validator.message(
                        "AssetId",
                        this.state.formData.AssetId,
                        "required:Asset ID"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    )
  }

  onChangeContainerBoxValue = (e) => {
    var containerID = e.target.value;
    this.setState({
      formData: {
        SerialNumber: this.state.formData.SerialNumber,
        SoftwareVer: this.state.formData.SoftwareVer,
        MacId: this.state.formData.MacId,
        tempId1: this.state.formData.tempId1,
        tempId2: this.state.formData.tempId2,
        AssetId: this.state.formData.AssetId,
        containerId: containerID,
        IdAssetDetail: 0,
        palletId: this.state.formData.palletId
      }
    });
  }

  containerBox = () => {
    var options = [];
    for (var index = 1; index <= this.state.totalQuantity; index++) {
      options.push(<option value={index} key={index} selected={index == this.state.formData.containerId ? "selected" : ""}>{index}</option>);
    }
    return options;
  }

  render() {
    this.serialItemsResponse();
    return (
      <div>
        <ToastContainer />
        <Modal isOpen={this.state.showScanSection} toggle={() => this.props.onChildUpdateScanItemView(false)} className='serial-popup pop'>
          <ModalHeader toggle={() => this.props.onChildUpdateScanItemView(false)}>Receive Now</ModalHeader>
          <ModalBody>
            <form action="" ref={form => this.form = form}>
              <div className="row">
                <div className="col-md-6">
                  <Card>
                    <CardBody>
                      <div className="form-row">
                        <div className="form-group col-md-5">
                          <label>Tag#:</label>
                        </div>
                        <div className="form-group col-md-6">
                          <label id="tagNumber" name="tagNumber" >{this.state.tagNumber}</label>
                        </div>
                        <div className="form-group col-md-5">
                          <label>Lot#:</label>
                        </div>
                        <div className="form-group col-md-6">
                          <label id="lotNumber" name="lotNumber" >
                            {(this.state.lotNumber != "") ? this.state.lotNumber : CONSTANTS.RECEIVING_MASTER.NA}
                          </label>
                        </div>
                        <div className="form-group col-md-5">
                          <label> Received / Total Qty :</label>
                        </div>
                        <div className="form-group col-md-6">
                          <div className="row">
                            <div className="col-md-12 pr-1">
                              <label id="qtyReceived" name="qtyReceived" >
                                {(this.state.qtyReceived != "" && this.state.quantityLeft != "") ? this.state.qtyReceived - this.state.quantityLeft + "/" + this.state.qtyReceived : CONSTANTS.RECEIVING_MASTER.NA}
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-5">
                          <label>Receiving Bin:</label>
                        </div>
                        <div className="form-group col-md-6">
                          <div className="row">
                            <div className="col-md-12 pr-1">
                              <label>{(this.state.binNumber != "") ? "EX - " + this.state.binNumber : CONSTANTS.RECEIVING_MASTER.NA}</label>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-md-5">
                          <label>Mapped P/N:</label>
                        </div>
                        <div className="form-group col-md-6">
                          {/* <input type="text" className="form-control" id="mappedPartNumber" name="mappedPartNumber" value={this.state.mappedPartNumber} disabled={this.state.stateDisabled} /> */}
                          <label id="mappedPartNumber" name="mappedPartNumber" >
                            {(this.state.mappedPartNumber != "") ? this.state.mappedPartNumber : CONSTANTS.RECEIVING_MASTER.NA}
                          </label>
                        </div>
                        <div className="form-group col-md-5">
                          <label>Mapped Rev:</label>
                        </div>
                        <div className="form-group col-md-6">
                          {/* <input type="text" className="form-control" id="mappedRevisionNumber" name="mappedRevisionNumber" value={this.state.mappedRevisionNumber} disabled={this.state.stateDisabled} /> */}
                          <label id="mappedRevisionNumber" name="mappedRevisionNumber" >
                            {(this.state.mappedRevisionNumber != "") ? this.state.mappedRevisionNumber : CONSTANTS.RECEIVING_MASTER.NA}
                          </label>
                        </div>
                        <div className="form-group col-md-5">
                          <label>Incoming P/N:</label>
                        </div>
                        <div className="form-group col-md-6">
                          {/* <input type="text" className="form-control" id="partNumber" name="partNumber" value={this.state.partNumber} disabled={this.state.stateDisabled} /> */}
                          <label id="partNumber" name="partNumber" >
                            {(this.state.partNumber != "") ? this.state.partNumber : CONSTANTS.RECEIVING_MASTER.NA}
                          </label>
                        </div>
                        <div className="form-group col-md-5">
                          <label>Incoming Rev:</label>
                        </div>
                        <div className="form-group col-md-6">
                          {/* <input type="text" className="form-control" id="revisionNumber" name="revisionNumber" value={this.state.revisionNumber} disabled={this.state.stateDisabled} /> */}
                          <label id="revisionNumber" name="revisionNumber" >
                            {(this.state.revisionNumber != "") ? this.state.revisionNumber : CONSTANTS.RECEIVING_MASTER.NA}
                          </label>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
                <div className="col-md-6">
                  {this.serialNumberView()}
                </div>
                {/* <div className="col-md-6">
                </div> */}
              </div>
              {/* {( this.state.serialStart <= this.state.groupOfSerials) ? this.serialNumberView() : <div></div> } */}
              {/* { (this.state.totalContainers == this.state.containerId) ? <div></div> : this.serialNumberView() } */}
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.props.onChildUpdateScanItemView(false)}>Close</Button>
            <Button color="primary">Post Serial &amp; Lot Details to M2M</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = {
  post_serials: post_serials,
  reset_action: reset_state_serial
};

const mapStateToProps = state => {
  return {
    stateOfSerialItems: state.serial_items,
    stateOfAction: state.user
  };
};

BoxScanningComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(BoxScanningComponent);

export default BoxScanningComponent;