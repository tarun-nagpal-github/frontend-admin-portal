import React from "react";
import { Col } from "reactstrap";

export default function NoRecordsFound() {
  return (
    <React.Fragment>
      <Col>
        <div class="container h-100">
          <div class="row h-100 justify-content-center align-items-center">
            <span>No records Found! </span>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
}
