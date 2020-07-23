import React, { Component } from "react";
import { Row, Col, Button } from 'react-bootstrap';

// TypeScript, define the properties and state we expect passed to this component
interface IButtonLoaderProps {
  isLoading: Boolean,
  text: string,
  isSubmit: Boolean,
  name?: string,
  onClick?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
};

interface IButtonLoaderState {};

export default class ButtonLoader extends Component<IButtonLoaderProps, IButtonLoaderState> {
  render() {
    var el = null;
    if (this.props.isLoading) {
      if (this.props.isSubmit) {
        el = (<Button name={this.props.name} style={{cursor: 'not-allowed'}} type="submit" disabled><img alt="Loading" style={{height: '20px', width: 'auto'}} src="/images/YCZH.gif" /></Button>);
      } else {
        el = (<Button onClick={this.props.onClick} name={this.props.name} style={{cursor: 'not-allowed'}} type="button" disabled><img alt="Loading" style={{height: '20px', width: 'auto'}} src="/images/YCZH.gif" /></Button>);
      }
    } else {
      if (this.props.isSubmit) {
        el = (<Button name={this.props.name} type="submit">{this.props.text}</Button>);
      } else {
        el = (<Button onClick={this.props.onClick} name={this.props.name} type="button">{this.props.text}</Button>);
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