import React, { Component } from "react";
import { Row, Col, Button, ButtonProps } from 'react-bootstrap';

// TypeScript, define the properties and state we expect passed to this component
interface IButtonLoaderProps {
  isLoading: Boolean,
  text: string,
  isSubmit: Boolean
};

interface IButtonLoaderState {};

export default class ButtonLoader extends Component<IButtonLoaderProps, IButtonLoaderState> {
  render() {
    var el = null;
    if (this.props.isLoading) {
      if (this.props.isSubmit) {
        el = (<Button style={{cursor: 'not-allowed'}} type="submit" disabled><img style={{height: '20px', width: 'auto'}} src="/images/YCZH.gif" /></Button>);
      } else {
        el = (<Button style={{cursor: 'not-allowed'}} type="button" disabled><img style={{height: '20px', width: 'auto'}} src="/images/YCZH.gif" /></Button>);
      }
    } else {
      if (this.props.isSubmit) {
        el = (<Button type="submit">{this.props.text} &gt;</Button>);
      } else {
        el = (<Button type="button">{this.props.text} &gt;</Button>);
      }
    }
    return (
      <Row className="m-1">
        <Col md="12">
          {el}
        </Col>
      </Row>
    );
  }
}