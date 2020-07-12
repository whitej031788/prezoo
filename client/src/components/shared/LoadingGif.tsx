import React, { Component } from "react";
import { Row, Col } from 'react-bootstrap';
import './LoadingGif.css';

// TypeScript, define the properties and state we expect passed to this component
interface ILoadingGifProps {
  isLoading: Boolean
};

interface ILoadingGifState {};

export default class LoadingGif extends Component<ILoadingGifProps, ILoadingGifState> {
  render() {
    var el = null;
    if (this.props.isLoading) {
      el = (
        <Row>
          <Col md="12" className="text-center">
            <img className="loading-gif" src="/images/main-upload.gif" alt="Loading" />
          </Col>
        </Row>
      );
    }
    return el;
  }
}