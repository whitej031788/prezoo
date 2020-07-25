import React, { Component } from "react";
import Redux from 'redux';
import { Container, Row, Col, Tabs, Tab, Button } from 'react-bootstrap';
import './LiveCollab.css';
import io from 'socket.io-client';
import { receivePresentation }  from '../actions/presentationActions';
import { receiveUser}  from '../actions/userActions';
import { IProject } from '../interfaces/IProject';
import { ISlide } from '../interfaces/ISlide';
import { IUser } from '../interfaces/IUser';
import { IPresentation } from '../interfaces/IPresentation';
import SlideShow from './shared/SlideShow';
import CopyText from './shared/CopyText';
import ChatArea from './chat/ChatArea';
import { connect } from 'react-redux';
import { Editor, EditorState, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import ProjectService from '../services/projectService';
import StorageService from '../services/storageService';
import { RootState } from "../reducers";

// TypeScript, define the properties and state we expect passed to this component
interface ILiveCollabProps {
  guid: string,
  dispatch: Redux.Dispatch,
  presentation: IPresentation,
  user: IUser
};

interface ILiveCollabState {
  isLoaded: Boolean,
  project?: IProject,
  elapsedTime: number,
  elapsedTimeDisplay: string,
  socket?: SocketIOClient.Socket,
  presentation: {slideNumber: number},
  notes: {[key: number]: EditorState},
  videoDom: HTMLVideoElement,
  peerConnections: any
};

class LiveCollab extends Component<ILiveCollabProps, ILiveCollabState> {
  constructor(props: ILiveCollabProps) {
    super(props);
    this.state = { 
      isLoaded: false,
      peerConnections: {},
      videoDom: document.querySelector("video") as HTMLVideoElement,
      project: undefined,
      elapsedTime: 0,
      elapsedTimeDisplay: '',
      presentation: {slideNumber: 0},
      socket: undefined,
      notes: {0: EditorState.createEmpty()}
    };

    this.countUp = this.countUp.bind(this);
    this.startCounting = this.startCounting.bind(this);
    this.onSlideSelect = this.onSlideSelect.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }

  onEditorChange(editorState: EditorState) {
    let notes = this.state.notes;
    notes[this.props.presentation.slideNumber] = editorState;
    this.setState({
      notes: notes
    });
  }

  componentWillMount() {
    window.onunload = window.onbeforeunload = () => {
      if (this.state.socket) {
        this.state.socket.emit('chatLeave', { timestamp: new Date(), sender: this.props.user.userName, message: 'left' });
        this.state.socket.close();
      }
    }
    this.getSlides();
  }

  componentDidMount() {
    let cachedData = StorageService.getPresFromLocalStorage(this.props.guid);

    if (cachedData) {
      let updateState = JSON.parse(cachedData);
      this.props.dispatch(receivePresentation(updateState.presentation.slideNumber));
      this.props.dispatch(receiveUser(updateState.user.userName));
    } else {
      this.props.dispatch(receivePresentation(0));
    }

    this.setState({
      videoDom: document.querySelector("video") as HTMLVideoElement,
      socket: io((process.env.REACT_APP_WS_URL + '?projectGuid=' + this.props.guid) as string)
    }, () => this.socket());
  }

  componentDidUpdate() {
    StorageService.setPresLocalStorage(this.props.guid, this.props);
  }

  socket() {
    if (this.state.socket) {
      this.state.socket.on('changeSlide', (msg: number) => {
        this.props.dispatch(receivePresentation(msg));
      });

      this.state.socket.on("watcher", (id: number) => {
        const config = {
          iceServers: [
            {
              urls: ["stun:stun.l.google.com:19302"]
            }
          ]
        };
        let peerConnectionsTemp = this.state.peerConnections;
        const peerConnection = new RTCPeerConnection(config);
        peerConnectionsTemp[id] = peerConnection;
        this.setState({peerConnections: peerConnectionsTemp});
      
        let stream = this.state.videoDom.srcObject as MediaStream;
        stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));
        peerConnection.onicecandidate = event => {
          if (event.candidate && this.state.socket) {
            this.state.socket.emit("candidate", id, event.candidate);
          }
        };
      
        peerConnection
          .createOffer()
          .then(sdp => peerConnection.setLocalDescription(sdp))
          .then(() => {
            if (this.state.socket) {
              this.state.socket.emit("offer", id, peerConnection.localDescription);
            }
          });
      });
      
      this.state.socket.on("answer", (id: string, description: string) => {
        this.state.peerConnections[id].setRemoteDescription(description);
      });
      
      this.state.socket.on("candidate", (id: string, candidate: RTCIceCandidateInit | undefined) => {
        this.state.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
      });

      this.state.socket.on("disconnectPeer", (id: string) => {
        this.state.peerConnections[id].close();
        delete this.state.peerConnections[id];
      });

      // Media contrains
      const constraints = {
        video: { facingMode: "user" }
        // Uncomment to enable audio
        // audio: true,
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          let video = document.querySelector("video") as HTMLVideoElement;
          video.srcObject = stream;
          this.setState({videoDom: video});
          if (this.state.socket) {
            this.state.socket.emit("broadcaster");
          }
        })
        .catch(error => console.error(error));
    }
  }
  
  onSlideSelect(index: number) {
    // We maybe want to save the notes here too
    /*axios.post(process.env.REACT_APP_API_URL + "/slide/notes", {
      slideId: this.state.project.Slide,
      notes: this.state.ownerName
    })
    .then(res => { // then print response status
      let slides = res.data.Slides;
      let initNotes: {[key: number]: EditorState} = {0: EditorState.createEmpty()};

      slides.forEach(function (value: ISlide, i: number) {
        // We init the first editor, so just skip it here in case
        if (i !== 0) {
          initNotes[i] = EditorState.createWithContent(ContentState.createFromText('Hello'));
        }
      });

      this.setState({project: res.data, notes: initNotes});
      this.startCounting();
    }).catch(err => {
      console.log(err);
    })*/
    if (this.state.socket) {
      this.state.socket.emit('changeSlide', index );
    }
  }

  changeTab(selectedTab: string) {
    console.log(selectedTab);
  }

  getSlides() {
    ProjectService.getSlides(this.props.guid)
    .then(res => { // then print response status
      let slides = res.data.project.Slides;
      let initNotes: {[key: number]: EditorState} = {0: EditorState.createEmpty()};

      slides.forEach(function (value: ISlide, i: number) {
        // We init the first editor, so just skip it here in case
        if (i !== 0) {
          initNotes[i] = EditorState.createWithContent(ContentState.createFromText(''));
        }
      });

      this.setState({project: res.data.project, notes: initNotes});
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

    let slidePreview = null;
    // Show a preview if we are not at the end
    if (this.state.project && this.props.presentation.slideNumber < this.state.project.Slides.length - 1) {
      slidePreview = (
        <img
          src={process.env.REACT_APP_ASSET_URL + this.state.project.Slides[this.props.presentation.slideNumber + 1].fileName} alt="Next Slide" className="slide-show-img-preview"
        />
      )
    }

    return (
      <div className="component-root mt-3">
        <Container>
          {this.state.project && (
          <Row>
            <Col md="8" className="text-center">
              <h1 className="route-title">{this.state.project.projectName}</h1>
              <Row>
                {/* <Col md="4">
                  <Tabs defaultActiveKey="slide-show" id="live-collab-controls" onSelect={this.changeTab}>
                    <Tab eventKey="slide-show" title="Slide Show">
                    </Tab>
                    <Tab eventKey="web-browser" title="Web Browser">
                    </Tab>
                  </Tabs>
                </Col> */}
                <Col md="4">
                  <span>Attendee Link:</span> <CopyText theText={shareLinkAttend} />
                </Col>
                <Col md="4">{this.state.elapsedTimeDisplay}</Col>
              </Row>
              <SlideShow styles={{height: '350px'}} slideNumber={this.props.presentation.slideNumber} onSlideSelect={this.onSlideSelect} project={this.state.project} showControls={true} />
              <Editor placeholder={'Enter your notes here'} editorState={this.state.notes[this.props.presentation.slideNumber]} onChange={this.onEditorChange} />
            </Col>
            <Col md="4">
              <Row>
                <Col md="6" className="text-center">
                  <video className="host-camera" playsInline autoPlay muted></video>
                </Col>
                {/* <Col md="6" className="text-center">
                  {slidePreview}
                </Col> */}
              </Row>
              <Row>
                <Col md="12" className="prezooBorder">
                  <ChatArea socket={this.state.socket} projectGuid={this.props.guid} />
                </Col>
              </Row>
              <Row>
                <Col md="12" className="mt-5 mb-5 text-center">
                  <Button type="button">Wrap Up</Button>
                </Col>
              </Row>
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

export default connect(mapStateToProps)(LiveCollab);