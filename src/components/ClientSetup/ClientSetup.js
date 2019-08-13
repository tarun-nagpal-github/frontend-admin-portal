import React from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap";
import DatePicker from "react-datepicker";
// import './Blankpage.css';
class ClientSetup extends React.Component {
    constructor(props){
        super(props);
        this.state = {            
            launchDate : new Date()
        }        
    }
  selectedDateHandle = date => {
    this.setState({
      launchDate: date
    });
  };
  render() {
    return (
      <div>
        <div className="page-title">
          <Row>
            <Col sm={6}>
              <h6>Client Setup</h6>
            </Col>
            <Col sm={6}>
              <Breadcrumb className="float-left float-sm-right">
                <BreadcrumbItem>
                  <a href="#">Home</a>
                </BreadcrumbItem>
                <BreadcrumbItem active>Page Title</BreadcrumbItem>
              </Breadcrumb>
            </Col>
          </Row>
        </div>
        <Row>
          <Col md={6} className="mb-3">
            <Card className="card-statistics h-100">
              <CardBody>
                <Col sm={12} className="px-0 pb-2">
                  <h4 className="border-bottom pb-1 font-weight-bold">
                    Client Setup
                  </h4>
                </Col>
                <div className="form-row">
                  <label className="col-md-3 col-form-label font-weight-bold">
                    Client Code:
                  </label>
                  <div className="form-group col-md-6 m-0 py-2">
                    <p className="m-0 p-0">ABC</p>
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-3 col-form-label font-weight-bold">
                    Client Name:
                  </label>
                  <div className="form-group col-md-6 m-0 py-2">
                    <p className="m-0 p-0">Client Name</p>
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-3 col-form-label font-weight-bold">
                    Client Address:
                  </label>
                  <div className="form-group col-md-6 m-0 py-2">
                    <p className="m-0 p-0">
                      123 Main Street, any Town, CA-000000
                    </p>
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-4 col-form-label font-weight-bold">
                    Launch Date:
                  </label>
                  <div className="form-group col-md-6 m-0 py-2">                    
                    <DatePicker
                      className="form-control"
                      selected={this.state.launchDate}
                      onChange={this.selectedDateHandle}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-4 col-form-label font-weight-bold">
                    Services Signed up For:
                  </label>
                  <div className="form-group col-md-6 m-0 py-2">
                    <input
                      type="input"
                      className="form-control"
                      name="launchDate"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="card-statistics h-100">
              <CardBody>
                <Col sm={12} className="px-0 pb-2">
                  <h4 className="border-bottom pb-1 font-weight-bold">
                    Fulfillment Options
                  </h4>
                </Col>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    Allow Online Order Creation:
                  </label>
                  <div className="form-check p-1 ml-3">
                    <input type="checkbox" className="form-check-input mt-2" />
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    Allow Upload Order Creation:
                  </label>
                  <div className="form-check p-1 ml-3">
                    <input type="checkbox" className="form-check-input mt-2" />
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    Allow API Order Creation:
                  </label>
                  <div className="form-check p-1 ml-3">
                    <input type="checkbox" className="form-check-input mt-2" />
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    Allow Shopify Order Creation:
                  </label>
                  <div className="form-check p-1 ml-3">
                    <input type="checkbox" className="form-check-input mt-2" />
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    CA reseller Permit #:
                  </label>
                  <div className="form-group py-1">
                    <input
                      type="input"
                      className="form-control"
                      name="resellerPermit"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="card-statistics h-100">
              <CardBody>
                <Col sm={12} className="px-0 pb-2">
                  <h4 className="border-bottom pb-1 font-weight-bold">
                    Same Day Shipping Settings
                  </h4>
                </Col>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    Max Approval Time (Domestic):
                  </label>
                  <div className="form-group col-md-6 pt-2">
                    <input type="input" className="form-control" name="" />
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    Max Approval Time (International):
                  </label>
                  <div className="form-group col-md-6 pt-2">
                    <input type="input" className="form-control" name="" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="card-statistics h-100">
              <CardBody>
                <Col sm={12} className="px-0 pb-2">
                  <h4 className="border-bottom pb-1 font-weight-bold">
                    International Shipping Settings
                  </h4>
                </Col>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    Allow International shipping:
                  </label>
                  <div className="form-check p-1 ml-3">
                    <input type="checkbox" className="form-check-input mt-2" />
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    Partner's fulfill internationally:
                  </label>
                  <div className="form-check p-1 ml-3">
                    <input type="checkbox" className="form-check-input mt-2" />
                  </div>
                </div>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    Notify Trade Compliance Team:
                  </label>
                  <div className="form-check p-1 ml-3">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <input
                      type="input"
                      className="form-control ml-2"
                      name="email"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card className="card-statistics h-100">
              <CardBody>
                <Col sm={12} className="px-0 pb-2">
                  <h4 className="border-bottom pb-1 font-weight-bold">
                    Outbond Serial Number &amp; Lot# Tracking
                  </h4>
                </Col>
                <div className="form-row">
                  <label className="col-md-6 col-form-label font-weight-bold">
                    Outbond Tracking:
                  </label>
                  <div className="form-check p-1 ml-3">
                    <input type="input" className="form-control" name="" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
export default ClientSetup;
