import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';

export default class AppNav extends Component<{}, {}> {
  render() {
    return (
      <Navbar bg="white" expand="lg">
        <Link to="/"><img src="/images/Prezoo_free-file.png" alt="Prezoo" className="brand-logo" /></Link>
      </Navbar>
    )
  }
}