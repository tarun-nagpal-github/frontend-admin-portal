import React from "react";
import { Card, CardBody } from "reactstrap";
export class ComingSoon extends React.Component {
  render() {
    return (
      <Card className="card-statistics h-100">
        <CardBody>
          <div className="mb-30 mt-60" style={{ height: 300 }}>
            <center>
              <div className="mt-100">
                <h1>
                  <b>Coming Soon !</b>
                </h1>
              </div>
            </center>
          </div>
        </CardBody>
      </Card>
    );
  }
}
