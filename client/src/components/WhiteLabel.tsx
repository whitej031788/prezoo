import React, { Component } from "react";
import { Container, Row,  Col } from 'react-bootstrap';

class WhiteLabel extends Component {
  render() {
    return (
      <Container className="fill-home-screen" fluid>
        <Row>
          <Container className="p-5">
            <Col md={{span: 10, offset: 1}}>
              <h1 className="main-title">White Label</h1>
            </Col>
          </Container>
        </Row>
      </Container>
    );
  }
}

export default WhiteLabel;