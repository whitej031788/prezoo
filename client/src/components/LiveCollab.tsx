import React, { Component } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import './LiveCollab.css';
import axios from 'axios';
import { IProject } from '../interfaces/IProject';
import SlideShow from './shared/SlideShow';
import CopyText from './shared/CopyText';
import ChatArea from './chat/ChatArea';

// TypeScript, define the properties and state we expect passed to this component
interface ILiveCollabProps {
  guid: string
};

interface ILiveCollabState {
  isLoaded: Boolean,
  project?: IProject
};

class LiveCollab extends Component<ILiveCollabProps, ILiveCollabState> {
  constructor(props: ILiveCollabProps) {
    super(props);
    this.state = { 
      isLoaded: false,
      project: undefined
    };
  }

  componentWillMount() {
    this.getSlides();
  }

  getSlides() {
    axios.get(process.env.REACT_APP_API_URL + "/project/slides/" + this.props.guid)
    .then(res => { // then print response status
      this.setState({project: res.data});
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    let shareLinkAttend = process.env.REACT_APP_BASE_URL + '/prezoo-live/' + this.props.guid;

    return (
      <div className="component-root mt-3">
        <Container>
          {this.state.project && (
          <Row>
            <Col md="7" className="text-center">
              <SlideShow project={this.state.project} />
              <Col md="12" className="prezooBorder">
                  NOTES SECTION
              </Col>
            </Col>
            <Col md="5">
              <Col md="12">
                Timer, links, collaborators, attendees
              </Col>
              <Col md="12" className="prezooBorder">
                <ChatArea projectGuid={this.props.guid} />
              </Col>
            </Col>
          </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default LiveCollab;