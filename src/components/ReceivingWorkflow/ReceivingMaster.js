import React from "react";
import { Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { connect } from "react-redux";
import CONSTANTS_IMPORT from "../../config/constants.json";
import classnames from 'classnames';
import { Breadcrumb } from "../Elements/Breadcrumb";
import OrphanReceipts from "./OrphanReceipts";
import MissingPartNumber from "./MissingPartNumber";
import ReadyToMove from "./ReadyToMove";
import ReceivingQueue from "./ReceivingQueue";
import "./ReceivingMaster.scss";
import TaggedReceiving from "./TaggedReceiving";
import { currentRoute } from "../../reduxUtils/actions/currentRoute";
import ACTIONS from "../../config/ActionList.json";
import { getReceivingCountAction } from "../../reduxUtils/actions/receiving";
const CONSTANTS = CONSTANTS_IMPORT.RECEIVING_MASTER;

class ReceivingMaster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authToken: this.props.stateOfAction.authToken,
      tabbordericon: '1'
    };
  }


  tabbordericon(tab) {
    if (this.state.tabbordericon !== tab) {
      this.setState({
        tabbordericon: tab
      });
    }
  }

  isActionAllowed = (actionName = "") => {
    return (this.props.actions.indexOf(actionName) >= 0) ? true : false;
  }

  componentWillMount() {
    this.props.getReceivingCountAction({zone:this.props.stateOfZone.zone});
    this.props.currentRoute(location.hash); // TODO: refine this service
  }

  render() { 
    return (
      <div className="receiving-workflow">
        <Breadcrumb title={CONSTANTS.PAGE} prev={CONSTANTS.HOME} current={CONSTANTS.ORPHAN_DASHBOARD} />
        <Card className="card-statistics mb-3">
          <CardBody>
            <div className="tab tab-border">
              <Nav tabs>
                {/* Orphan Reciepts Tab */}
                {this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.ORPHAN.LIST_RECIEPTS) && 
                <NavItem >
                  <NavLink id="orphan-receipt" className={classnames({ active: this.state.tabbordericon === '1' })} onClick={() => { this.tabbordericon('1'); }}>
                    <i className="fa fa-users"></i> {CONSTANTS.ORPHAN_TAB} <span className="ml-10 badge badge-pill badge-warning">{this.props.receivingCount.orphanReceiptCount != 0 ? this.props.receivingCount.orphanReceiptCount : ""}</span>
                  </NavLink>
                </NavItem>
                }
                {/* MISSING_PN_TAB Tab */}
                {this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.MISSING_PART.LIST_RECIEPTS) && 
                <NavItem >
                  <NavLink id="missing-info" className={classnames({ active: this.state.tabbordericon === '2' })} onClick={() => { this.tabbordericon('2'); }}>
                    <i className="fa fa-file"></i> {CONSTANTS.MISSING_PN_TAB} <span className="ml-10 badge badge-pill badge-warning">{this.props.receivingCount.missingPartReceiptCount != 0 ? this.props.receivingCount.missingPartReceiptCount : ""}</span>
                  </NavLink>
                </NavItem>
                }
                {/* RECEIVING_QUEUE_TAB */}
                {this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.RECIEVING_QUEUE.LIST_RECIEPTS) && 
                <NavItem >
                  <NavLink id="receiving-queue" className={classnames({ active: this.state.tabbordericon === '3' })} onClick={() => { this.tabbordericon('3'); }}>
                    <i className="fa fa-tasks"></i> {CONSTANTS.RECEIVING_QUEUE_TAB} <span className="ml-10 badge badge-pill badge-warning">{this.props.receivingCount.receivingQueueCount != 0 ? this.props.receivingCount.receivingQueueCount : ""}</span>
                  </NavLink>
                </NavItem>
                }

                {/* TAGGED_RECEIVING_TAB */}
                {this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.TAGGED_RECIEVING.LIST_RECIEPTS) && 
                <NavItem >
                  <NavLink id="tagged-receiving" className={classnames({ active: this.state.tabbordericon === '4' })} onClick={() => { this.tabbordericon('4'); }}>
                    <i className="fa fa-tag"></i>{CONSTANTS.TAGGED_RECEIVING_TAB} <span className="ml-10 badge badge-pill badge-warning">{this.props.receivingCount.tagReceiptCount != 0 ? this.props.receivingCount.tagReceiptCount : ""}</span>
                  </NavLink>
                </NavItem>
                }
                {/* RECEIVING_READY_TO_MOVE */}
                {this.isActionAllowed(ACTIONS.RECIEVING.WORKFLOW.READY_TO_MOVE.LIST_RECIEPTS) && 
                <NavItem ><NavLink id="ready-to-move" className={classnames({ active: this.state.tabbordericon === '5' })}
                  onClick={() => { this.tabbordericon('5'); }}><i className="fa fa-truck"></i> {CONSTANTS.RECEIVING_READY_TO_MOVE} <span className="ml-10 badge badge-pill badge-warning">{this.props.receivingCount.readyToMoveCount != 0 ? this.props.receivingCount.readyToMoveCount : ""}</span></NavLink></NavItem>
                }
              </Nav>
              <TabContent activeTab={this.state.tabbordericon} >
                {/* Orphan Receipts */}
                <TabPane tabId="1">
                  {(this.state.tabbordericon == "1") ? <OrphanReceipts actions={this.props.actions} /> : ""}
                </TabPane>

                <TabPane tabId="2">
                  {(this.state.tabbordericon == "2") ? <MissingPartNumber actions={this.props.actions} /> : ""}
                </TabPane>

                <TabPane tabId="4">
                  {(this.state.tabbordericon == "4") ? <TaggedReceiving actions={this.props.actions} /> : ""}
                </TabPane>

                <TabPane tabId="3" >
                  {(this.state.tabbordericon == "3") ? <ReceivingQueue actions={this.props.actions} /> : ""}
                </TabPane>

                <TabPane tabId="5" >
                  {(this.state.tabbordericon == "5") ? <ReadyToMove actions={this.props.actions} /> : ""}
                </TabPane>
              </TabContent>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    stateOfAction: state.user,
    receivingCount: state.receiving_count,
    stateOfZone: state.storeZoneReducer
  };
};

const mapDispatchToProps = {
  getReceivingCountAction,
  currentRoute: currentRoute
};

ReceivingMaster = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceivingMaster);

export default ReceivingMaster;
