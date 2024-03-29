import React, { Component } from "react";
import Redux from 'redux';
import { Container, Row, Col, Form, Button, Navbar, Nav } from 'react-bootstrap';
import './Attendee.css';
import io from 'socket.io-client';
import { receivePresentation }  from '../actions/presentationActions';
import { IProject } from '../interfaces/IProject';
import { IPresentation } from '../interfaces/IPresentation';
import { IProjectPresentation } from '../interfaces/IProjectPresentation';
import { RootState } from "../reducers";
import { IUser } from '../interfaces/IUser';
import SlideShow from './shared/SlideShow';
import { connect } from 'react-redux';
import ButtonLoader from './shared/ButtonLoader';
import { receiveUser } from '../actions/userActions';
import ProjectService from '../services/projectService';
import StorageService from '../services/storageService';
import { Editor, EditorState } from 'draft-js';
import CopyText from './shared/CopyText';

// TypeScript, define the properties and state we expect passed to this component
interface IAttendeeProps {
  guid: string,
  dispatch: Redux.Dispatch,
  presentation: IPresentation,
  user: IUser
};

interface IAttendeeState {
  project?: IProject,
  socket?: SocketIOClient.Socket,
  validated: boolean,
  isFullScreen: boolean,
  userName: string,
  projectPresentation?: IProjectPresentation,
  videoDom: HTMLVideoElement,
  peerConnection: RTCPeerConnection,
  handLoading: Boolean,
  question: EditorState,
  successMessage: string
};

class Attendee extends Component<IAttendeeProps, IAttendeeState> {
  constructor(props: IAttendeeProps) {
    super(props);

    const config = {
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302"]
        }
      ]
    };

    this.state = { 
      project: undefined,
      projectPresentation: undefined,
      videoDom: document.querySelector("video") as HTMLVideoElement,
      peerConnection: new RTCPeerConnection(config),
      validated: false,
      isFullScreen: false,
      userName: '',
      socket: undefined,
      handLoading: false,
      question: EditorState.createEmpty(),
      successMessage: ''
    };

    this.joinRoom = this.joinRoom.bind(this);
    this.sendReaction = this.sendReaction.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.submitQuestion = this.submitQuestion.bind(this);
  }

  componentWillMount() {
    this.getSlides();
    let self = this;
    
    document.onfullscreenchange = function (event) {
      // Detect full screen and not to change styling and classes
      let fullScreenElement = document.fullscreenElement;
      self.setState({isFullScreen: fullScreenElement ? true : false}, function() {
        let message = self.state.isFullScreen ? 'Went full screen' : 'Exit full screen';
        if (self.state.socket) {
          self.state.socket.emit('chatMessage', { timestamp: new Date(), sender: self.props.user.userName + ' - Guest', message: message });
        }
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

    this.setState({
      videoDom: document.querySelector("video") as HTMLVideoElement,
      socket: io((process.env.REACT_APP_WS_URL + '?projectGuid=' + this.props.guid) as string)
    }, () => {
      if (this.state.socket) {
        this.state.socket.emit('chatJoin', { timestamp: new Date(), sender: this.props.user.userName + ' - Guest', message: 'joined' });
      }
      this.socket();
    });
  }

  componentDidUpdate() {
    StorageService.setPresLocalStorage(this.props.guid, this.props);
  }

  onEditorChange(editorState: EditorState) {
    this.setState({
      question: editorState
    });
  }

  submitQuestion() {
    let self = this;
    let questionText = this.state.question.getCurrentContent().getPlainText('\u0001');
    if (!questionText.trim()) {
      return;
    }

    let message = "❓❓❓: " + questionText;
    if (this.state.socket) {
      this.state.socket.emit('chatMessage', { timestamp: new Date(), sender: this.props.user.userName + ' - Guest', message: message });
    }
    this.setState({
      question: EditorState.createEmpty(), 
      successMessage: "Your question has been submitted to the host"
    }, () => {
      setTimeout(function(){ self.setState({successMessage: ''}); }, 3000);
    });
  }

  sendReaction(reaction: string) {
    let self = this;

    this.setState({handLoading: true});
    if (this.state.socket) {
      let message = "Reaction: " + reaction;
      this.state.socket.emit('chatMessage', { timestamp: new Date(), sender: this.props.user.userName + ' - Guest', message: message });
      setTimeout(function(){ self.setState({handLoading: false}); }, 2000);
    }
  }

  socket() {
    if (this.state.socket) {
      this.state.socket.on('changeSlide', (msg: number) => {
        this.props.dispatch(receivePresentation(msg));
      });

      this.state.socket.on("offer", (id: string, description: RTCSessionDescriptionInit) => {
        let peerConnTemp = this.state.peerConnection;

        peerConnTemp
          .setRemoteDescription(description)
          .then(() => this.state.peerConnection.createAnswer())
          .then(sdp => this.state.peerConnection.setLocalDescription(sdp))
          .then(() => {
            if (this.state.socket) {
              this.state.socket.emit("answer", id, this.state.peerConnection.localDescription);
            }
          });

        peerConnTemp.ontrack = event => {
          let video = document.querySelector("video") as HTMLVideoElement;
          if (video) {
            video.srcObject = event.streams[0];
            this.setState({videoDom: video});
          }
        };

        peerConnTemp.onicecandidate = event => {
          if (event.candidate && this.state.socket) {
            this.state.socket.emit("candidate", id, event.candidate);
          }
        };

        this.setState({peerConnection: peerConnTemp});
      });

      this.state.socket.on("candidate", (id: string, candidate: RTCIceCandidateInit | undefined) => {
        this.state.peerConnection
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch(e => console.error(e));
      });
      
      this.state.socket.on("connect", () => {
        if (this.state.socket) {
          this.state.socket.emit("watcher");
        }
      });
      
      this.state.socket.on("broadcaster", () => {
        if (this.state.socket) {
          this.state.socket.emit("watcher");
        }
      });
      
      this.state.socket.on("disconnectPeer", () => {
        this.state.peerConnection.close();
      });
      
      window.onunload = window.onbeforeunload = () => {
        if (this.state.socket) {
          this.state.socket.emit('chatLeave', { timestamp: new Date(), sender: this.props.user.userName + ' - Guest', message: 'left' });
          this.state.socket.close();
        }
      };
    }
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
      this.setState({project: res.data.project, projectPresentation: res.data.presentation});
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
      if (this.state.socket) {
        this.state.socket.emit('chatJoin', { timestamp: new Date(), sender: this.state.userName + ' - Guest', message: 'joined' });
      }
      this.props.dispatch(receiveUser(this.state.userName));
      this.goFullScreen(undefined);
    }

    this.setState({validated: true});
  };

  render() {
    const username = this.props.user.userName;
    let appliedClass = username ? "" : "vertical-center";
    let fullScreenClass = this.state.isFullScreen ? "currently-full-screen" : "";
    let videoJsx = (<video className="host-camera" style={{width: '240px', height: 'auto'}} playsInline autoPlay muted></video>);
    let questionJsx = (
      <>
        <Editor placeholder={'Post question or comment'} editorState={this.state.question} onChange={this.onEditorChange} />
        <Button onClick={this.submitQuestion} type="button" className="w-100 mt-2 mb-2">Submit Question</Button>
        {this.state.successMessage && (<Col md="12" className="mt-2 prez-box">{this.state.successMessage}</Col>)}
      </>
    );

    let reactionText = (<span>&#10003;</span>);

    let reactionsJsx = (
      <table className="m-auto">
        <tr>
          <td>
            <div className="prez-box-react" onClick={() => this.sendReaction('🤚')}>
              {this.state.handLoading && reactionText}
              {!this.state.handLoading && <span aria-label="Raise Hand" role="img">🤚</span>}
            </div>
          </td>
          <td>
            <div className="prez-box-react" onClick={() => this.sendReaction('👏')}>
              {this.state.handLoading && reactionText}
              {!this.state.handLoading && <span aria-label="Raise Hand" role="img">👏</span>}
            </div>
          </td>
          <td>
            <div className="prez-box-react" onClick={() => this.sendReaction('🤔')}>
              {this.state.handLoading && reactionText}
              {!this.state.handLoading && <span aria-label="Raise Hand" role="img">🤔</span>}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div className="prez-box-react" onClick={() => this.sendReaction('😴')}>
              {this.state.handLoading && reactionText}
              {!this.state.handLoading && <span aria-label="Raise Hand" role="img">😴</span>}
            </div>
          </td>
          <td>
            <div className="prez-box-react" onClick={() => this.sendReaction('👎')}>
              {this.state.handLoading && reactionText}
              {!this.state.handLoading && <span aria-label="Raise Hand" role="img">👎</span>}
            </div>
          </td>
          <td>
            <div className="prez-box-react" onClick={() => this.sendReaction('🦄')}>
              {this.state.handLoading && reactionText}
              {!this.state.handLoading && <span aria-label="Raise Hand" role="img">🦄</span>}
            </div>
          </td>
        </tr>
      </table>
    )

    let enableSettings = {
      enableQuestions: this.state.projectPresentation && this.state.projectPresentation.enableQuestions,
      enableReactions: this.state.projectPresentation && this.state.projectPresentation.enableReactions
    }

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
      <Row id="full-screen-target">
        <Col md="3" className="text-center">
          {(!this.state.isFullScreen && enableSettings.enableReactions) && reactionsJsx}
          {(!this.state.isFullScreen && enableSettings.enableQuestions) && questionJsx}
          {!this.state.isFullScreen && (<Button onClick={this.goFullScreen} className="mr-1 mb-1" style={{display: 'inline', position: 'absolute', bottom: '0', right: '0'}} type="button">Full screen &gt;</Button>)}
        </Col>
        <Col md="9" className="text-left">
          <SlideShow 
            slideNumber={this.props.presentation.slideNumber} 
            project={this.state.project} 
            showControls={false}
            isFullScreen={this.state.isFullScreen}
            isAttendeeView={true}
            goFullScreen={this.goFullScreen}
          />
        </Col>

      </Row>

    ) : null;

    let shareLinkAttend = process.env.REACT_APP_BASE_URL + '/prezoo-live/' + this.props.guid;

    return (
      <div className={"component-root " + appliedClass}>
        <Container fluid>
          {this.state.project && (
          <div>
            <Navbar className="prez-back">
              <Nav>
                <Nav.Item>
                  <img src="/images/new-logo.png" alt="Prezoo" className="brand-logo mr-3" />
                </Nav.Item>
              </Nav>
              <Nav>
                <Form.Control className="dark-input" type="text" name="inviteLink" value={shareLinkAttend} disabled />
              </Nav>
              <Nav>
                <CopyText theText={shareLinkAttend} />
              </Nav>
              <Nav className="ml-auto text-right host-camera-nav">
                <Nav.Item>
                  {videoJsx}
                </Nav.Item>
              </Nav>
            </Navbar>
            <Row>
              <Col md="12" className={"text-center " + fullScreenClass}>
                {joinUser}
                {slideShow}
              </Col>
            </Row>
          </div>
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