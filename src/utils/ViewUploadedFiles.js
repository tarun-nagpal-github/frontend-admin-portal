import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  Table

} from "reactstrap";
import ReactTable from "react-table";
import { connect } from "react-redux";
import CONSTANTS from "../config/constants.json";
import ExtronTable from "../components/Elements/ExtronTable";


class ViewUploadedFiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDelete: this.props.isDelete,
      authToken: this.props.stateOfLogin.authToken,
      showUploadedItems: this.props.showUploadedItems
    };


    this.columns = [
      {
        Header: "Name",
        accessor: "fileName",
        Cell: ({ original }) => {
          return <a href={original.url} target="_blank">{original.fileName}</a>
        }
      },
      // {
      //   Header: "Id",
      //   accessor: "id"
      // },
      {
        Header: "Download",
        accessor: "fileName",
        Cell: ({ original }) => {
          return <a className="fa fa-download" href={original.url} target="_blank">   </a>
        }
      }

    ];
  }

  showUploadedDocs = () => {
    this.setState({
      showUploadedItems: true
    })
  }

  hideUploadedDocs = () => {
    this.setState({
      showUploadedItems: false
    })
  }
  showButton = () => {
    let length = (this.props.attachments) ? this.props.attachments.length : 0;
    // return (length > 0) ? (<button onClick={() => this.showUploadedDocs()} className="btn btn-styling btn-sm">View ({length})</button>) : null;
    return (length > 0) ? (<span onClick={() => this.showUploadedDocs()} className="view-action">View ({length})</span>) : null;
  }

  render() {
    return (
      <React.Fragment>
        <this.showButton />
        <Modal isOpen={this.state.showUploadedItems} toggle={this.hideUploadedDocs} >
          <ModalHeader  >{CONSTANTS.FILE.VIEW_UPLOADS}</ModalHeader>
          <ModalBody>
            <ExtronTable
              // filterable={true}
              parentRecords={this.props.attachments}
              parentColumns={this.columns}
              defaultSorted={[{ id: "fileName", desc: true }]}
              defaultPageSize={10}
              minRows={0}
              showPagination={false}
              showPaginationBottom={false}
              showPaginationTop={false}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.hideUploadedDocs}>
              {CONSTANTS.GENERIC.BUTTONS.CLOSE}
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
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

const mapDispatchToProps = {};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewUploadedFiles);