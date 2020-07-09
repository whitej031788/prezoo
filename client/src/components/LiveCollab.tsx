import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import './LiveCollab.css';
import axios from 'axios';
import io from 'socket.io-client';
import { receiveProject}  from '../actions/projectActions';
import { IProject } from '../interfaces/IProject';
import SlideShow from './shared/SlideShow';
import CopyText from './shared/CopyText';
import ChatArea from './chat/ChatArea';
import { connect } from 'react-redux';

// TypeScript, define the properties and state we expect passed to this component
interface ILiveCollabProps {
  guid: string,
  dispatch: any,
  presentation: any
};

interface ILiveCollabState {
  isLoaded: Boolean,
  project?: IProject,
  elapsedTime: number,
  elapsedTimeDisplay: string,
  socket: SocketIOClient.Socket,
  presentation: any
};

class LiveCollab extends Component<ILiveCollabProps, ILiveCollabState> {
  constructor(props: ILiveCollabProps) {
    super(props);
    this.state = { 
      isLoaded: false,
      project: undefined,
      elapsedTime: 0,
      elapsedTimeDisplay: '',
      presentation: {slideNumber: 0},
      socket: io((process.env.REACT_APP_WS_URL + '?projectGuid=' + this.props.guid) as string)
    };

    this.countUp = this.countUp.bind(this);
    this.startCounting = this.startCounting.bind(this);
    this.onSlideSelect = this.onSlideSelect.bind(this);
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
  
  onSlideSelect(index: number) {
    this.state.socket.emit('changeSlide', index );
  }

  getSlides() {
    axios.get(process.env.REACT_APP_API_URL + "/project/slides/" + this.props.guid)
    .then(res => { // then print response status
      this.setState({project: res.data});
      this.startCounting();
    }).catch(err => {
      console.log(err);
    })
  }

  startCounting() {
    setInterval(this.countUp, 1000);
  }

  countUp() {
    this.setState(({ elapsedTime }) => ({ 
      elapsedTime: elapsedTime + 1,
      elapsedTimeDisplay: this.secondsToHms(elapsedTime + 1)
    }));
  }

  secondsToHms(d: number) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay; 
  }

  render() {
    let shareLinkAttend = process.env.REACT_APP_BASE_URL + '/prezoo-live/' + this.props.guid;

    return (
      <div className="component-root mt-3">
        <Container>
          {this.state.project && (
          <Row>
            <Col md="7" className="text-center">
              <SlideShow slideNumber={this.props.presentation.slideNumber} onSlideSelect={this.onSlideSelect} project={this.state.project} showControls={true} />
              <Col md="12" className="prezooBorder">
                  NOTES SECTION
              </Col>
            </Col>
            <Col md="5">
              <Row>
                <Col md="6">
                  <span>Attendee Link:</span> <CopyText theText={shareLinkAttend} />
                </Col>
                <Col md="6">{this.state.elapsedTimeDisplay}</Col>
              </Row>
              <Col md="12" className="prezooBorder">
                <ChatArea socket={this.state.socket} projectGuid={this.props.guid} />
              </Col>
            </Col>
          </Row>
          )}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: ILiveCollabState) => ({
  presentation: state.presentation
});

export default connect(mapStateToProps)(LiveCollab);