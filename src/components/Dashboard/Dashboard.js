import React, { Component } from "react";
import {
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  CardBody,
  Card
} from "reactstrap";
import "./Dashboard.css";
import { ComingSoon } from "../Custompage/ComingSoon/ComingSoon";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <div className="page-content">
          <Row>
            <Col md={12} className="mb-30">
              <Card className="card-statistics h-100">
                <CardBody>
                  <div className="mb-30 mt-60" style={{ height: 300 }}>
                    <center>
                      <div className="mt-100">
                        <h1>
                          <b>Welcome to Extron !</b>
                        </h1>
                      </div>
                    </center>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default Dashboard;
