import React, { Component } from "react";
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import './LiveCollab.css';
import io from 'socket.io-client';
import { receivePresentation }  from '../actions/presentationActions';
import { receiveUser}  from '../actions/userActions';
import { IProject } from '../interfaces/IProject';
import { ISlide } from '../interfaces/ISlide';
import SlideShow from './shared/SlideShow';
import CopyText from './shared/CopyText';
import ChatArea from './chat/ChatArea';
import { connect } from 'react-redux';
import {Editor, EditorState, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import ProjectService from '../services/projectService';
import StorageService from '../services/storageService';
import { RootState } from "../reducers";

// TypeScript, define the properties and state we expect passed to this component
interface ILiveCollabProps {
  guid: string,
  dispatch: any,
  presentation: {slideNumber: number},
};

interface ILiveCollabState {
  isLoaded: Boolean,
  project?: IProject,
  elapsedTime: number,
  elapsedTimeDisplay: string,
  socket: SocketIOClient.Socket,
  presentation: {slideNumber: number},
  notes: {[key: number]: EditorState}
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
      socket: io((process.env.REACT_APP_WS_URL + '?projectGuid=' + this.props.guid) as string),
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
    this.getSlides();
    this.socket();
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
    this.state.socket.emit('changeSlide', index );
  }

  changeTab(selectedTab: string) {
    console.log(selectedTab);
  }

  getSlides() {
    ProjectService.getSlides(this.props.guid)
    .then(res => { // then print response status
      let slides = res.data.Slides;
      let initNotes: {[key: number]: EditorState} = {0: EditorState.createEmpty()};

      slides.forEach(function (value: ISlide, i: number) {
        // We init the first editor, so just skip it here in case
        if (i !== 0) {
          initNotes[i] = EditorState.createWithContent(ContentState.createFromText(''));
        }
      });

      this.setState({project: res.data, notes: initNotes});
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
        <Col md="12" className="text-right">
          <img
            src={process.env.REACT_APP_ASSET_URL + this.state.project.Slides[this.props.presentation.slideNumber + 1].fileName} alt="Next Slide" className="slide-show-img-preview"
          />
        </Col>
      )
    }

    return (
      <div className="component-root mt-3">
        <Container>
          {this.state.project && (
          <Row>
            <Col md="7" className="text-center">
              <Row>
                <Col md="12">
                <Tabs defaultActiveKey="slide-show" id="live-collab-controls" onSelect={this.changeTab}>
                  <Tab eventKey="slide-show" title="Slide Show">
                  </Tab>
                  {/* <Tab eventKey="web-browser" title="Web Browser">
                  </Tab> */}
                </Tabs>
                </Col>
                {slidePreview}
              </Row>
              <SlideShow styles={{height: '350px'}} slideNumber={this.props.presentation.slideNumber} onSlideSelect={this.onSlideSelect} project={this.state.project} showControls={true} />
              <Editor placeholder={'Enter your notes here'} editorState={this.state.notes[this.props.presentation.slideNumber]} onChange={this.onEditorChange} />
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

const mapStateToProps = (state: RootState) => ({
  presentation: state.presentation,
  user: state.user
});

export default connect(mapStateToProps)(LiveCollab);