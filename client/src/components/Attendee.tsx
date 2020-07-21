import React, { Component } from "react";
import Redux from 'redux';
import { Container, Row, Col, Form } from 'react-bootstrap';
import './Attendee.css';
import io from 'socket.io-client';
import { receivePresentation }  from '../actions/presentationActions';
import { IProject } from '../interfaces/IProject';
import { IPresentation } from '../interfaces/IPresentation';
import { RootState } from "../reducers";
import { IUser } from '../interfaces/IUser';
import SlideShow from './shared/SlideShow';
import { connect } from 'react-redux';
import ButtonLoader from './shared/ButtonLoader';
import { receiveUser } from '../actions/userActions';
import ProjectService from '../services/projectService';
import StorageService from '../services/storageService';

// TypeScript, define the properties and state we expect passed to this component
interface IAttendeeProps {
  guid: string,
  dispatch: Redux.Dispatch,
  presentation: IPresentation,
  user: IUser
};

interface IAttendeeState {
  project?: IProject,
  socket: SocketIOClient.Socket,
  validated: boolean,
  isFullScreen: boolean,
  userName: string,
  presentation: IPresentation
};

class Attendee extends Component<IAttendeeProps, IAttendeeState> {
  constructor(props: IAttendeeProps) {
    super(props);
    this.state = { 
      project: undefined,
      presentation: {slideNumber: 0},
      validated: false,
      isFullScreen: false,
      userName: '',
      socket: io((process.env.REACT_APP_WS_URL + '?projectGuid=' + this.props.guid) as string)
    };

    this.joinRoom = this.joinRoom.bind(this);
  }

  componentWillMount() {
    this.getSlides();
    this.socket();
    let self = this;
    
    document.onfullscreenchange = function (event) {
      // Detect full screen and not to change styling and classes
      let fullScreenElement = document.fullscreenElement;
      self.setState({isFullScreen: fullScreenElement ? true : false}, function() {
        let message = self.state.isFullScreen ? 'Went full screen' : 'Exit full screen';
        self.state.socket.emit('chatMessage', { timestamp: new Date(), sender: self.props.user.userName, message: message });
      });
    };
  }

  componentDidMount() {
    let cachedData = StorageService.getPresFromLocalStorage(this.props.guid);

    if (cachedData) {
      let updateState = JSON.parse(cachedData);
      this.props.dispatch(receivePresentation(updateState.presentation.slideNumber));
      this.props.dispatch(receiveUser(updateState.user.userName));
    } else {
      this.props.dispatch(receivePresentation(0));
      this.props.dispatch(receiveUser(""));
    }
  }

  componentDidUpdate() {
    StorageService.setPresLocalStorage(this.props.guid, this.props);
  }

  socket() {
    this.state.socket.on('changeSlide', (msg: number) => {
      this.props.dispatch(receivePresentation(msg));
    });
  }

  goFullScreen(event?: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    if (document.fullscreenEnabled) {
      let el = document.querySelector("#full-screen-target");
      if (el) {
        el.requestFullscreen().catch(err => {
          console.log(err);
          alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });;
      }
    } else {
      alert('Browser does not support full screen presenting');
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  getSlides() {
    ProjectService.getSlides(this.props.guid)
    .then(res => { // then print response status
      this.setState({project: res.data});
    }).catch(err => {
      console.log(err);
    })
  }

  joinRoom = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      this.state.socket.emit('chatJoin', { timestamp: new Date(), sender: this.state.userName + ' - Guest', message: 'joined' });
      this.props.dispatch(receiveUser(this.state.userName));
      this.goFullScreen(undefined);
    }

    this.setState({validated: true});
  };

  render() {
    const username = this.props.user.userName;
    let appliedClass = username ? "" : "vertical-center";

    const joinUser = !username ? (
      <Col md={{span: 6, offset: 3}} xs="12">
        <Form noValidate validated={this.state.validated} onSubmit={this.joinRoom}>
          <Form.Group controlId="formProjectName">
            <Form.Label>Tell the host you are here:</Form.Label>
            <Form.Control required type="text" name="userName" placeholder="Please enter your name" value={this.state.userName} onChange={this.handleChange.bind(this)} />
            <Form.Control.Feedback type="invalid">
              Please provide a valid name
            </Form.Control.Feedback>
          </Form.Group>
          <ButtonLoader text="Join presentation" isLoading={false} isSubmit={true} />
        </Form>
      </Col>
    ) : null;
    const slideShow = username ? (
      <SlideShow 
        slideNumber={this.props.presentation.slideNumber} 
        project={this.state.project} 
        showControls={false}
        isFullScreen={this.state.isFullScreen}
        isAttendeeView={true}
        goFullScreen={this.goFullScreen}
      /> 
    ) : null;
    return (
      <div className={"component-root " + appliedClass} id="full-screen-target">
        <Container fluid>
          {this.state.project && (
          <Row>
            <Col md="12" className="text-center">
              {joinUser}
              {slideShow}
            </Col>
          </Row>
          )}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  presentation: state.presentation,
  user: state.user
});

export default connect(mapStateToProps)(Attendee);