import React, { Component } from "react";
import { Container, Row,  Col } from 'react-bootstrap';

class Pricing extends Component {
  render() {
    return (
      <Container className="fill-home-screen" fluid>
        <Row>
          <Container className="p-5">
            <Col md={{span: 10, offset: 1}}>
              <h1 className="main-title">Pricing</h1>
            </Col>
          </Container>
        </Row>
      </Container>
    );
  }
}

export default Pricing;