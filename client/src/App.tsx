import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps  } from "react-router-dom";

import { Navbar, Nav  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Home from "./components/Home";
import HowItWorks from "./components/HowItWorks";
import AboutUs from "./components/AboutUs";
import Pricing from "./components/Pricing";
import WhiteLabel from "./components/WhiteLabel";

import PreUpload from "./components/PreUpload";
import PrePreview from "./components/PrePreview";
import LiveCollab from "./components/LiveCollab";
import Attendee from "./components/Attendee";
import AppNav from "./components/shared/AppNav";
import ProjEdit from "./components/ProjEdit";

interface MatchParams {
  guid: string;
}

interface ChildComponentProps extends RouteComponentProps<MatchParams> {
}

const HomeNavRoute = ({ component: Component, ...rest }: any) => {
  return (
    <div>
      <Navbar bg="white" expand="lg">
        <Link to="/"><img src="/images/Prezoo_free-file.png" alt="Prezoo" className="brand-logo" /></Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Link to="/how-it-works">How it Works</Link>
          </Nav>
          <Nav>
            <Link to="/about-us">About Us</Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Route {...rest} render={(props) => (<Component {...props} {...rest} />)} />
    </div>
  )
};

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <HomeNavRoute exact path="/" component={Home} />
          <HomeNavRoute exact path="/how-it-works" component={HowItWorks} />
          <HomeNavRoute exact path="/about-us" component={AboutUs} />
          <Route exact path="/pre-prezoo/upload/:guid" render={( {match}: ChildComponentProps) => (
            <><AppNav /><PreUpload guid={match.params.guid} /></> )} />
          <Route exact path="/pre-prezoo/edit/:guid" render={( {match}: ChildComponentProps) => (
            <><AppNav /><ProjEdit guid={match.params.guid} /></> )} />
          <Route exact path="/pre-prezoo/preview/:guid" render={( {match}: ChildComponentProps) => (
            <><AppNav /><PrePreview guid={match.params.guid} /></> )} />
          <Route exact path="/prezoo-live/collaborator/:guid" render={( {match}: ChildComponentProps) => (
            <><AppNav /><LiveCollab guid={match.params.guid} /></> )} />
          <Route exact path="/prezoo-live/:guid" render={( {match}: ChildComponentProps) => (
            <><AppNav /><Attendee guid={match.params.guid} /></> )} />
        </Switch>
      </Router>
    );
  }
}
export default App;