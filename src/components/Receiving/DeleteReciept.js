import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  Row,
  Col
} from "reactstrap";
import ReactCodeInput from "react-code-input";
import { delete_reciept, delete_reciept_reset } from "../../reduxUtils/actions/receiving";
import { connect } from "react-redux";
import CONSTANTS from "./../../config/constants.json"
class DeleteReciept extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDelete: this.props.isDelete,
      pin: 0,
      pinError: false,
      selected: this.props.selected,
      authToken: this.props.stateOfLogin.authToken,
    };
  }

  hideDeleteAlert = () => {
    this.props.onChange();
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      isDelete: nextProps.isDelete,
      selected: nextProps.selected
    });
  }

  pinChange = value => {
    this.setState({ pin: value });
  };

  onDeleteConfirm = (pin = null) => {
    if (this.state.pin.toString().length < 3) {
      this.setState({
        pinError: true
      });
      return false;
    }

    this.state.pinError = false;
    this.setState(
      {
        selected: Object.keys(this.state.selected),
        pin: this.state.pin
      },
      () => {
        this.props.delete_reciept(this.state);
      }
    );
  };

  render() {
    return (
      <Modal isOpen={this.state.isDelete}>
        <ModalHeader>{CONSTANTS.DELETE_RECIEPT.CONFIRM_DELETE}</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={6}> Please Enter PIN </Col>
            <Col md={6}>
              <ReactCodeInput
                id="pin"
                name="pin"
                type="text"
                onChange={this.pinChange}
                value={this.state.pin}
                autoFocus={true}
                pattern="[0-9]"
              />
              {this.state.pinError == true && (
                <div className="error">{CONSTANTS.DELETE_RECIEPT.ENTER_PIN}</div>
              )}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.onDeleteConfirm}>
            {CONSTANTS.GENERIC.BUTTONS.OK}
          </Button>
          <Button color="secondary" onClick={this.hideDeleteAlert}>
            {CONSTANTS.GENERIC.BUTTONS.CANCEL}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    stateOfLogin: state.user,
    stateReciept: state.edit_receiving,
    stateDeleteReciept: state.delete_reciept,
    stateOfReceivingList: state.receiving_list
  };
};

const mapDispatchToProps = {
  delete_reciept: delete_reciept,
  delete_reciept_reset: delete_reciept_reset
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteReciept);

