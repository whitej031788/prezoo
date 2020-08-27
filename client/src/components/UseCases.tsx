import React, { Component } from "react";
import { Container, Row,  Col } from 'react-bootstrap';

class UseCases extends Component {
  render() {
    return (
      <Container className="fill-home-screen" fluid>
        <Row>
          <Container className="p-5">
            <Col md={{span: 10, offset: 1}}>
              <h1 className="main-title">How It Works</h1>
              <br></br>
              <h6 className="text-center">The aim of Prezoo is not to replace your web conferencing or presentation tools but to give you an easy way to present deliver your finished work.</h6>
            </Col>
            <br></br>
            <br></br>
            <Col md={{span: 10, offset: 1}}>
              <h2 className="text-center">For Presenters</h2>
              <br></br>
              <p className="text-center sub-text">1. Upload your finished project in pdf format</p>
            </Col>
          </Container>
        </Row>
      </Container>
    );
  }
}

export default UseCases;