import React, { Component } from "react";
import { Row, Col } from 'react-bootstrap';
import './LoadingLeaf.css';

// TypeScript, define the properties and state we expect passed to this component
interface ILoadingLeafProps {
  isLoading: Boolean
};

interface ILoadingLeafState {};

export default class LoadingLeaf extends Component<ILoadingLeafProps, ILoadingLeafState> {
  constructor(props: ILoadingLeafProps) {
    super(props);
  }

  render() {
    var el = null;
    if (this.props.isLoading) {
      el = (
        <Row>
          <Col md="12" className="text-center">
            <img className="loading-gif" src="/images/loading-leaf.gif" alt="Loading" />
          </Col>
        </Row>
      );
    }
    return el;
  }
}