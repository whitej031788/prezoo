import React, { Component } from "react";
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './PrePreview.css';
import { IProject } from '../interfaces/IProject';
import { IProjectPresentation } from '../interfaces/IProjectPresentation';
import { withRouter, RouteComponentProps } from "react-router-dom";
import SlideShow from './shared/SlideShow';
import CopyText from './shared/CopyText';
import ProjectService from '../services/projectService';
import ButtonLoader from './shared/ButtonLoader';
import PresentationService from '../services/presentationService';

// TypeScript, define the properties and state we expect passed to this component
interface IPrePreviewProps extends RouteComponentProps {
  guid: string
};

interface IPrePreviewState {
  isLoaded: Boolean,
  project?: IProject,
  presentation?: IProjectPresentation,
  localSlideNumber: number,
  enableQuestions: boolean,
  enableReactions: boolean,
  isLoading: boolean
};

class PrePreview extends Component<IPrePreviewProps, IPrePreviewState> {
  constructor(props: IPrePreviewProps) {
    super(props);
    this.state = { 
      isLoaded: false,
      project: undefined,
      localSlideNumber: 0,
      enableQuestions: true,
      enableReactions: true,
      isLoading: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.saveAndStartPresentation = this.saveAndStartPresentation.bind(this);
  }

  componentWillMount() {
    this.getSlides();
  }

  getSlides() {
    ProjectService.getSlides(this.props.guid)
    .then(res => { // then print response status
      this.setState({project: res.data.project, presentation: res.data.presentation});
    }).catch(err => {
      console.log(err);
    })
  }

  saveAndStartPresentation() {
    this.setState({isLoading: true});
    // It really shouldn't be undefined, but this Typescript is doing my head in
    let presentationId = this.state.presentation ? this.state.presentation.id : 0;

    PresentationService.updatePresentation(presentationId, {
      enableQuestions: this.state.enableQuestions,
      enableReactions: this.state.enableReactions
    })
    .then(res => {
      this.setState({isLoading: false});
      let redirectUrl = '/prezoo-live/collaborator/' + this.props.guid;
      this.props.history.push(redirectUrl);
    }).catch(err => {
      this.setState({isLoading: false});
      console.log(err);
    })
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let checkBoxNames = ['enableQuestions', 'enableReactions'];
    const { name, checked, value } = event.currentTarget;
    const newValue = checkBoxNames.includes(name) ? checked : value;
    this.setState(prevState => ({
      ...prevState,
      [name]: newValue,
    }));
  };

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
              <Col md="12" className="mt-4">
                <h4>Settings</h4>
                <Form>
                  <Form.Check
                    type="checkbox"
                    label="Enable Questions"
                    checked={this.state.enableQuestions}
                    onChange={this.handleChange}
                    name="enableQuestions"
                  />
                  <Form.Check
                    type="checkbox"
                    label="Enable Reactions"
                    checked={this.state.enableReactions}
                    onChange={this.handleChange}
                    name="enableReactions"
                  />
                </Form>
              </Col>
              <Col md="12" className="mt-5">
                <ButtonLoader name="startPresentation" text="Start your presentation!" isLoading={this.state.isLoading} isSubmit={false} onClick={this.saveAndStartPresentation} />
              </Col>
            </Col>
          </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default withRouter(PrePreview);