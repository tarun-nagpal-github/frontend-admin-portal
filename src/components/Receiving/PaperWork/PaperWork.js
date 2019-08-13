import React from "react";
import {
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  Row,
  Col
} from "reactstrap";
import CONSTANTS_IMPORT from "../../../config/constants.json";
import DATALIST from "../../../../Data/ReceivingAtDock.json";
import { connect } from "react-redux";
import ReactTable from "react-table";
import { Loader } from "react-overlay-loader";
import { GetPaperDocuments } from "../../../services/UploadPaperWorkService";
import { formatDate, checkIsArray } from "../../../utils/HelperFunctions";
import { edit_reciept_reset } from "../../../reduxUtils/actions/receiving";
import {
  delete_file,
  delete_file_reset
} from "../../../reduxUtils/actions/files";
import {
  fileUpload,
  isValidExtension,
  isValidFileSize,
  validDocumentExtensions
} from "../../../services/FileUploadService";
import swal from "sweetalert";
import ToolTip from "./../ToolTip";
import ExtronTable from "../../Elements/ExtronTable";
import { noRecordsAvailable } from "../../Elements/NoRecordsAvailable";
import ACTIONS from "../../../config/ActionList.json";
import { ToastContainer, toast } from "react-toastify";

const CONSTANTS_RECEIVING = CONSTANTS_IMPORT.RECEIVE_AT_DOCK_ADD;
class PaperWork extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: {},
      authToken: this.props.stateOfAction.authToken,
      isTooltipEnable: true,
      redirectState: false,
      picturesList: [],
      loader: false,
      file: null,
      isDelete: false,
      client: this.props.client,
      container: this.props.container,
      carrier: this.props.carrier,
      isAddReceiver: null,
      idReceiving: this.props.idReceiving
    };

    this.documentColumns = [
      {
        Header: "Document",
        id: "fileName",
        accessor: d => d.fileName,
        Cell: ({ original }) => {
          return (
            <a href={original.url} target="_blank">
              {original.fileName}
            </a>
          );
        }
      },
      {
        Header: "Date",
        id: "createdDate",
        accessor: d => d.createdDate,
        Cell: ({ original }) => {
          return formatDate(original.createdDate);
        }
      },
      {
        Header: "Action",
        id: "checkbox",
        accessor: "",
        sortable: false,
        Cell: ({ original }) => {
          return (
            <div className="text-center">
              <input
                type="checkbox"
                checked={
                  this.state.selectedFile[original.idReceivingAttachments] ===
                  true
                }
                onChange={() =>
                  this.toggleRowDocument(original.idReceivingAttachments)
                }
              />
            </div>
          );
        }
      }
    ];
  }

  loadExtronTable = () => {
    return (
      <div>
        <ExtronTable
          parentRecords={this.state.documentList}
          parentColumns={this.documentColumns}
          defaultSorted=""
          filterable={false}
          minRows={0}
          classes="-striped -highlight"
          defaultPageSize={5}
          showPaginationBottom={true}
          showPaginationTop={false}
        />
      </div>
    )
  }

  isActionAllowed = (actionName = "") => { 
    return (this.props.actions.indexOf(actionName) >= 0) ? true : false;
  }

  uploadDocument = async e => {
    let PAPER_WORK = 27;
    let payload = {};
    payload.file = e.target.files[0];
    payload.IdReceiving = this.props.receivingId;
    payload.attachmentType = PAPER_WORK;
    payload.authToken = this.props.stateOfAction.authToken;

    payload.client = this.props.client;
    payload.container = this.props.container;
    payload.carrier = this.props.carrier;

    if (this.props.carrier == "none") {
      swal("Please select Carrier");
      return true;
    } else if (!isValidExtension(e.target, validDocumentExtensions)) {
      swal(CONSTANTS_IMPORT.FILE.INVALID_DOCUMENT);
    } else if (!isValidFileSize(payload.file.size)) {
      swal(CONSTANTS_IMPORT.FILE.INVALID_SIZE);
    } else {
      this.setState({ loader: true });
      let result = await fileUpload(payload);
      if (result.status == 200) {
        // swal(CONSTANTS_IMPORT.FILE.UPLOAD_SUCCESS);
        toast.success(CONSTANTS_IMPORT.FILE.UPLOAD_SUCCESS, {});
        this.props.onChange(this.getUpdatedReceivingid(result));
        this.setState(
          { loader: false, idReceiving: this.getUpdatedReceivingid(result) },
          () => {
            this.getPaperList();
          }
        );
      } else {        
        toast.error(CONSTANTS_IMPORT.FILE.UPLOAD_FAILURE);
        this.setState({ loader: false });
      }
    }
  };

  getUpdatedReceivingid(result = null) {
    if (result) {
      let receivingid = result.data.data.receivingid;
      return receivingid == 0 || receivingid == null
        ? this.state.idReceiving
        : receivingid;
    }
    return null;
  }

  getPaperList = async () => {
    this.setState({ loader: true });
    let result = await GetPaperDocuments(this.state);
    this.setState({
      documentList: checkIsArray(result),
      loader: false,
      selectedFile: {}
    });
    this.props.edit_reciept_reset();
  };

  toggleRowDocument = id => {
    const newSelected = Object.assign({}, this.state.selectedFile);
    newSelected[id] = !this.state.selectedFile[id];
    this.setState({
      selectedFile: newSelected
    });
  };

  getPictures() {
    // Reload Pictures after Upload
    if (this.props.stateReciept.status == 200) {
      let formValues = this.props.stateReciept.recieptDetails;
      this.setState(
        {
          idReceiving: formValues.idReceiving
        },
        () => {
          this.getPaperList();
        }
      );
    }
    // Reload Pictures after Delete
    if (this.props.deleteFile.status == 200) {      
      this.getPaperList();
      this.props.delete_file_reset();
    }
  }
  confirmDelete = () => {
    if (Object.keys(this.state.selectedFile).length) {
      this.setState({
        isDelete: true
      });
    }
  };

  deleteFile = () => {
    this.setState(
      {
        isDelete: false,
        selectedFile: Object.keys(this.state.selectedFile)
      },
      () => {
        this.props.delete_file(this.state);
      }
    );
  };

  render() {
    this.getPictures();
    return (
      <Card className="card-statistics">
        {/* Modal */}
        <Modal isOpen={this.state.isDelete}>
          <ModalHeader>
            <h4 className="modal-title" style={{ paddingLeft: "6%" }}>
              Are you sure you want to Delete?
            </h4>
          </ModalHeader>
          <ModalFooter>
            <Button color="danger" onClick={this.deleteFile}>
              Ok
            </Button>
            <Button
              color="secondary"
              data-dismiss="modal"
              onClick={() => this.setState({ isDelete: false })}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal */}
        <CardBody>
          <div className="row">
          <ToastContainer />
            <div className="form-group col-md-6">
              <label className="font-weight-bold">
                {CONSTANTS_RECEIVING.UPLOAD_PAPERWORK}
                <ToolTip />
              </label>
            </div>
            <div className="form-group col-md-6">
              <div className="input-group">
                 {this.isActionAllowed(ACTIONS.RECIEVING.DOCK.UPLOAD_DOC) &&  
                 <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    name="uploadingDocument"
                    onChange={this.uploadDocument}
                    disabled={
                      this.props.receiptStatus == "disabled" ? "disabled" : ""
                    }
                  />
                  <label className="custom-file-label">File Upload</label>
                </div>
                 }
                {this.isActionAllowed(ACTIONS.RECIEVING.DOCK.DELETE_DOCUMENTS) &&  
                <div className="ml-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={this.confirmDelete}
                    disabled={
                      this.props.receiptStatus == "disabled" ? "disabled" : ""
                    }
                  >
                    Delete
                  </button>
                </div>
                }
              </div>
            </div>
          </div>
          <div className="">
            <Loader loading={this.state.loader} />
            {
              /* rendering datatable */
              (this.isActionAllowed(ACTIONS.RECIEVING.DOCK.LIST_DOCUMENTS) && (this.state.documentList && this.state.documentList.length > 0))
                ? this.loadExtronTable()
                : noRecordsAvailable("No Document Available.", "")
            }
          </div>
        </CardBody>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    stateOfAction: state.user,
    stateOfReceiving: state.create_receiving,
    stateReciept: state.edit_receiving,
    deleteFile: state.delete_file
  };
};

const mapDispatchToProps = {
  edit_reciept_reset: edit_reciept_reset,
  delete_file_reset: delete_file_reset,
  delete_file: delete_file
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaperWork);
