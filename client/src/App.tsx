import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, RouteComponentProps } from "react-router-dom";

import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import PrezooHome from "./components/Home";
import PreUpload from "./components/PreUpload";

interface MatchParams {
  guid: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {
}

class App extends Component {
  render() {
  return (
    <Router>
      <div>
        <Navbar bg="light" expand="lg">
          <Link to="/">Prezoo <img src="/images/leaf-logo.png" className="brand-logo" /></Link>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Link to="/more">More</Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route exact path="/">
            <PrezooHome />
          </Route>
          <Route path="/pre-prezoo/upload/:guid" render={( {match}: MatchProps) => (
            <PreUpload guid={match.params.guid} /> )} 
          />
        </Switch>
      </div>
    </Router>
  );
  }
}
export default App;