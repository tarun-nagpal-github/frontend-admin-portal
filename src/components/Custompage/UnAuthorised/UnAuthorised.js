import React from "react";
import { Row, Col, Card, CardBody, CardText, CardTitle, Button } from "reactstrap";
export class UnAuthorised extends React.Component {
  render() {
    return (
      <Card className="card-statistics h-100">
        <CardBody>
          <div className="mb-30 mt-60" style={{ height: 300 }}>
            <center>
              <div className="mt-100">

                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="error-template">

                        <h2>
                          You are not authorised to access this page !</h2>
                        <div className="error-details" style={{ marginBottom: "2%" }}>
                          Sorry, an error has occured, You are not authorised to access this page!
                </div>
                        <div className="error-actions">


                          <Button color="primary"  >
                            Dashboard
            </Button> &nbsp; &nbsp;
            <Button color="secondary" >
                            Contact Support
            </Button>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </center>
          </div>
        </CardBody>
      </Card>
    );
  }
}
