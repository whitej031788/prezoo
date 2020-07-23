import React, { Component } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './PrePreview.css';
import { IProject } from '../interfaces/IProject';
import SlideShow from './shared/SlideShow';
import CopyText from './shared/CopyText';
import ProjectService from '../services/projectService';

// TypeScript, define the properties and state we expect passed to this component
interface IPrePreviewProps {
  guid: string
};

interface IPrePreviewState {
  isLoaded: Boolean,
  project?: IProject,
  localSlideNumber: number
};

class PrePreview extends Component<IPrePreviewProps, IPrePreviewState> {
  constructor(props: IPrePreviewProps) {
    super(props);
    this.state = { 
      isLoaded: false,
      project: undefined,
      localSlideNumber: 0
    };
  }

  componentWillMount() {
    this.getSlides();
  }

  getSlides() {
    ProjectService.getSlides(this.props.guid)
    .then(res => { // then print response status
      this.setState({project: res.data.project});
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    let shareLinkAttend = process.env.REACT_APP_BASE_URL + '/prezoo-live/' + this.props.guid;
    let goLiveLink = process.env.REACT_APP_BASE_URL + '/prezoo-live/collaborator/' + this.props.guid;

    return (
      <div className="component-root">
        <Container>
          <h1 className="route-title">Project Preview</h1>
          {this.state.project && (
          <Row>
            <Col md="8" className="text-center">
              <SlideShow onSlideSelect={(index: number) => this.setState({localSlideNumber: index})} slideNumber={this.state.localSlideNumber} styles={{height: '350px'}} project={this.state.project} showControls={true} />
            </Col>
            <Col md="4">
              <Col md="12" className="mb-5"><p style={{fontWeight: 900, fontSize: '26px'}}>Host: {this.state.project.ownerName}</p></Col>
              <Col md="12" className="mt-5">Share Link with collaborators:                   
                <a className="ml-1" onClick={(e) => e.preventDefault()} href={goLiveLink}>Link</a>
                  <CopyText theText={goLiveLink} />
              </Col>
              <Col md="12" className="mt-2">Share Link with attendees:                   
                <a className="ml-1" onClick={(e) => e.preventDefault()} href={shareLinkAttend}>Link</a>
                  <CopyText theText={shareLinkAttend} />
              </Col>
              <Col md="12" className="mt-5" style={{position:'absolute', bottom: 0}}>
                <Link to={'/prezoo-live/collaborator/' + this.props.guid}><Button><div>Ready to present?</div><div>Collab center will open automatically</div></Button></Link>
              </Col>
            </Col>
          </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default PrePreview;