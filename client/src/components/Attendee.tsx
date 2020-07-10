import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import './Attendee.css';
import axios from 'axios';
import io from 'socket.io-client';
import { receiveProject}  from '../actions/projectActions';
import { IProject } from '../interfaces/IProject';
import SlideShow from './shared/SlideShow';
import { connect } from 'react-redux';

// TypeScript, define the properties and state we expect passed to this component
interface IAttendeeProps {
  guid: string,
  dispatch: any,
  presentation: {slideNumber: number},
};

interface IAttendeeState {
  isLoaded: Boolean,
  project?: IProject,
  socket: SocketIOClient.Socket,
  presentation: {slideNumber: number},
};

class Attendee extends Component<IAttendeeProps, IAttendeeState> {
  constructor(props: IAttendeeProps) {
    super(props);
    this.state = { 
      isLoaded: false,
      project: undefined,
      presentation: {slideNumber: 0},
      socket: io((process.env.REACT_APP_WS_URL + '?projectGuid=' + this.props.guid) as string)
    };
  }

  componentWillMount() {
    this.getSlides();
    this.socket();
  }

  socket() {
    this.state.socket.on('changeSlide', (msg: any) => {
      this.props.dispatch(receiveProject(msg));
    });
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
    return (
      <div className="component-root">
        <Container fluid>
          {this.state.project && (
          <Row>
            <Col md="12" className="text-center">
              <SlideShow slideNumber={this.props.presentation.slideNumber} project={this.state.project} showControls={false} />
            </Col>
          </Row>
          )}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: IAttendeeState) => ({
  presentation: state.presentation
});

export default connect(mapStateToProps)(Attendee);