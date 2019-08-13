import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import CONSTANTS from "../../config/constants.json";

class Footer extends Component {
  render() {
    return (
      <footer className="bg-white p-4">
        <Row>
          <Col md={6} style={{ left: 220 }}>
            <div className="text-center text-md-left">
              <p className="mb-0">
                {CONSTANTS.GENERIC.COPYRIGHT_TEXT_1} <a href="https://extroninc.com/" target="_blank">Extron Inc</a> . {CONSTANTS.GENERIC.COPYRIGHT_TEXT_2}
              </p>
            </div>
          </Col>
          <Col md={6}>
            <ul className="text-center text-md-right text-primary">
              <li className="list-inline-item mr-4">
                <a href="#" className="text-primary">Terms &amp; Conditions </a>{" "}
              </li>
              {/* <li className="list-inline-item">
                <a href="#">API Use Policy </a>{" "}
              </li> */}
              <li className="list-inline-item">
                <a href="#" className="text-primary">Privacy Policy </a>{" "}
              </li>
            </ul>
          </Col>
        </Row>
      </footer>
    );
  }
}
export default Footer;
