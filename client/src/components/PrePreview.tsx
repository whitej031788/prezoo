import React, { Component } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './PrePreview.css';
import axios from 'axios';
import { IProject } from '../interfaces/IProject';
import SlideShow from './shared/SlideShow';
import CopyText from './shared/CopyText';

// TypeScript, define the properties and state we expect passed to this component
interface IPrePreviewProps {
  guid: string
};

interface IPrePreviewState {
  isLoaded: Boolean,
  project?: IProject
};

class PrePreview extends Component<IPrePreviewProps, IPrePreviewState> {
  constructor(props: IPrePreviewProps) {
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
    let goLiveLink = '/prezoo-live/collaborator/' + this.props.guid;

    return (
      <div className="component-root">
        <Container>
          {this.state.project && (
          <Row>
            <Col md="8" className="text-center">
              <SlideShow styles={{height: '350px'}} project={this.state.project} showControls={true} />
            </Col>
            <Col md="4">
              <p>Host: {this.state.project.ownerName}</p>
              <div>Share Link with attendee's:                   
                <a className="ml-1" onClick={(e) => e.preventDefault()} href={shareLinkAttend}>Link</a>
                  <CopyText theText={shareLinkAttend} />
              </div>
              <Col md="12" className="mt-5">
                <Link to={goLiveLink}><Button><div>Ready to present?</div><div>Collab center will open automatically</div></Button></Link>
              </Col>
            </Col>
            <Col md="12">
              <b>Next</b>
            </Col>
            <Col md="12">
              <p>Share your link with attendee's or once you begin presenting. Open your slides to full screen and share that over your video hosting platform</p>
            </Col>
          </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default PrePreview;