import React, { Component } from 'react';
import { connect } from "react-redux";
import { reset_print_part_number, reset_print_tag_receipt, reset_print_label, reset_print_tagged_receiving } from "../reduxUtils/actions/printActions";
import { ToastContainer, toast } from "react-toastify";
import CONSTANTS from "../config/constants.json";
import { printDocumentPopUp } from '../utils/HelperFunctions';

class PrintDocument extends Component {
    constructor(props) {
        super(props);

        this.state = {
            success: false,
            error: false
        }
    }

    printDocumentResponse = () => {
        if((this.props.stateOfTagReceipt.status || this.props.stateOfTaggedReceiving.status || this.props.stateOfPartNumber.status || this.props.stateOfPrintLabel.status) == 200){
            if(this.props.stateOfPrintLabel.data){
                this.selfFnPrintDocAction(this.props.stateOfPrintLabel.data, "Extron Document", "height=auto,width=auto", this.props.reset_print_label());
            }

            if(this.props.stateOfTaggedReceiving.data){
                this.selfFnPrintDocAction(this.props.stateOfTaggedReceiving.data, "Extron Document", "height=auto,width=auto", this.props.reset_print_tagged_receiving());
            }

            if(this.props.stateOfPartNumber.data){
                this.selfFnPrintDocAction(this.props.stateOfPartNumber.data, "Extron Document", "height=auto,width=auto", this.props.reset_print_part_number());
            }

            if(this.props.stateOfTagReceipt.data){
                this.selfFnPrintDocAction(this.props.stateOfTagReceipt.data, "Extron Document", "height=auto,width=auto", this.props.reset_print_tag_receipt());
            }
        }
    }

    selfFnPrintDocAction = (url, header, style, callback) => {
        printDocumentPopUp(url, header, style);
        return callback;
    }

    render() {
        this.printDocumentResponse();
        return (
            <div></div>
        );
    }
}

const mapDispatchToProps = {
    reset_print_tag_receipt,
    reset_print_tagged_receiving,
    reset_print_label,
    reset_print_part_number
};

const mapStateToProps = state => {
    return {
        stateOfTagReceipt: state.tag_receipt_reducer,
        stateOfTaggedReceiving: state.tagged_receiving_reducer,
        stateOfPartNumber: state.part_number_reducer,
        stateOfPrintLabel: state.label_reducer,
    };
};

PrintDocument = connect(
    mapStateToProps,
    mapDispatchToProps
)(PrintDocument);

export default PrintDocument;