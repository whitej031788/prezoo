import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps  } from "react-router-dom";

import { Navbar, Nav  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from "./components/Home";
import UseCases from "./components/UseCases";
import AboutUs from "./components/AboutUs";
import Pricing from "./components/Pricing";
import WhiteLabel from "./components/WhiteLabel";

import PreUpload from "./components/PreUpload";
import PrePreview from "./components/PrePreview";
import LiveCollab from "./components/LiveCollab";
import Attendee from "./components/Attendee";

interface MatchParams {
  guid: string;
}

interface ChildComponentProps extends RouteComponentProps<MatchParams> {
}

class App extends Component {
  render() {
    return (
      <Router>
        <Navbar bg="white" expand="lg">
          <Link to="/"><img src="/images/Prezoo_free-file.png" alt="Prezoo" className="brand-logo" /></Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Link to="/use-cases">Use Cases</Link>
            </Nav>
            <Nav>
              <Link to="/about-us">About Us</Link>
            </Nav>
            <Nav>
              <Link to="/pricing">Pricing</Link>
            </Nav>
            <Nav>
              <Link to="/white-label">White Label</Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/use-cases" component={UseCases} />
          <Route exact path="/about-us" component={AboutUs} />
          <Route exact path="/pricing" component={Pricing} />
          <Route exact path="/white-label" component={WhiteLabel} />
          <Route exact path="/pre-prezoo/upload/:guid" render={( {match}: ChildComponentProps) => (
            <PreUpload guid={match.params.guid} /> )} />
          <Route exact path="/pre-prezoo/preview/:guid" render={( {match}: ChildComponentProps) => (
            <PrePreview guid={match.params.guid} /> )} />
          <Route exact path="/prezoo-live/collaborator/:guid" render={( {match}: ChildComponentProps) => (
            <LiveCollab guid={match.params.guid} /> )} />
          <Route exact path="/prezoo-live/:guid" render={( {match}: ChildComponentProps) => (
            <Attendee guid={match.params.guid} /> )} />
        </Switch>
      </Router>
    );
  }
}
export default App;