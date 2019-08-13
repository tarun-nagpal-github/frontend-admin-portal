import React, { Component } from 'react';
import Footer from './Footer';
import Header from './Header';
import { getReceivingCountAction } from "../../reduxUtils/actions/receiving";
import Sitebar from './Sitebar';
import { connect } from "react-redux";

class Base extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleactive: false
        };
        this.updateValue = this.updateValue.bind(this);
    }
    updateValue(value) {
        this.setState(prevState => ({
            toggleactive: !prevState.toggleactive
        }))
    }

    componentWillMount(){
        this.props.getReceivingCountAction({zone:this.props.stateOfZone.zone});
    }
    
    render() {
        return (
            <div className={this.state.toggleactive ? "wrapper  slide-menu" : "wrapper"}>
                <Header updateParent={this.updateValue} />
                <div className="container-fluid">
                    <div className="row">
                        <Sitebar />
                        <div className="content-wrapper">
                            {this.props.children}
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    getReceivingCountAction
};

const mapStateToProps = state => {
    return {
        stateOfReceivingCount: state.receiving_count,
        stateOfZone: state.storeZoneReducer
    };
};

Base = connect(
    mapStateToProps,
    mapDispatchToProps
)(Base);

export default Base;