import React, { Component } from "react";
import { Container, Row, Col, Form } from 'react-bootstrap';
import './PreUpload.css';
import { IProject } from '../interfaces/IProject';
import SlideShow from './shared/SlideShow';
import CopyText from './shared/CopyText';
import { withRouter, RouteComponentProps } from "react-router-dom";
import ButtonLoader from './shared/ButtonLoader';
import ProjectService from '../services/projectService';

// TypeScript, define the properties and state we expect passed to this component
interface IPreUploadProps extends RouteComponentProps {
  guid: string
};

interface IPreUploadState {
  isLoading: boolean,
  project?: IProject,
  projectName: string,
  ownerName: string,
  ownerEmail: string,
  validated: boolean
};

class PreUploadComponent extends Component<IPreUploadProps, IPreUploadState> {
  constructor(props: IPreUploadProps) {
    super(props);
    this.state = { 
      isLoading: false,
      project: undefined,
      projectName: '',
      ownerName: '',
      ownerEmail: '',
      validated: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitPreview = this.submitPreview.bind(this);
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  componentWillMount() {
    this.getSlides();
  }

  getSlides() {
    ProjectService.getSlides(this.props.guid)
    .then(res => { // then print response status
      this.setState({
        project: res.data,
        projectName: res.data.projectName ? res.data.projectName : '',
        ownerName: res.data.ownerName ? res.data.ownerName : '',
        ownerEmail: res.data.ownerEmail ? res.data.ownerEmail : ''
      });
    }).catch(err => {
      console.log(err);
    })
  }

  submitPreview = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const form = event.currentTarget;
  
    // It really shouldn't be undefined, but this Typescript is doing my head in
    let projectId = this.state.project ? this.state.project.id : 0;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      this.setState({isLoading: true});
      ProjectService.updateProject(projectId, {
        projectName: this.state.projectName,
        ownerName: this.state.ownerName,
        ownerEmail: this.state.ownerEmail
      })
      .then(res => {
        let redirectUrl = "/pre-prezoo/preview/" + res.data.projectGuid;
        this.props.history.push(redirectUrl);
      }).catch(err => {
        this.setState({isLoading: false});
        console.log(err);
      })
    }

    this.setState({validated: true});
  };

  render() {
    let shareLinkCollab = process.env.REACT_APP_BASE_URL + '/pre-prezoo/preview/' + this.props.guid;
    return (
      <div className="component-root">
        <Container>
          <Row>
            <Col md={{span: 10, offset: 1}}>
              <p>Actions</p>
              <ol>
                <li>Share your co-host link with collaborators and hit preview to get your presentation ready</li>
                <li>Share the "viewee" link to give guests a presentation views of your slides</li>
                <li>Alternatively, open your presentation mode from the hosts view and share over your video collaboration tool</li>
                <li>Chat and co-host with colleagues through our "host view" for a seamless presentation experience</li>
              </ol>
            </Col>
          </Row>
          {this.state.project && (
          <Row>
            <Col md="8" className="text-center">
              <SlideShow styles={{height: '350px'}} project={this.state.project} showControls={true} />
            </Col>
            <Col md="4">
              <Form noValidate validated={this.state.validated} onSubmit={this.submitPreview}>
                <Form.Group controlId="formProjectName">
                  <Form.Label>Your project name:</Form.Label>
                  <Form.Control required type="text" name="projectName" placeholder="Enter project name" value={this.state.projectName} onChange={this.handleChange} />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid project name
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formOwnerName">
                  <Form.Label>Your name:</Form.Label>
                  <Form.Control required type="text" name="ownerName" placeholder="Enter your name" value={this.state.ownerName} onChange={this.handleChange} />
                  <Form.Control.Feedback type="invalid">
                    Please provide a host name
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formOwnerEmail">
                  <Form.Label>Your email:</Form.Label>
                  <Form.Control required type="email" name="ownerEmail" placeholder="Enter email" value={this.state.ownerEmail} onChange={this.handleChange} />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email
                  </Form.Control.Feedback>
                </Form.Group>
              
                <div>Share this link: 
                  <a className="ml-1" onClick={(e) => e.preventDefault()} href={shareLinkCollab}>Link</a>
                  <CopyText theText={shareLinkCollab} />
                </div>
                <p>and code: {this.state.project.collabCode}</p>
                <ButtonLoader text="Preview presentation" isLoading={this.state.isLoading} isSubmit={true} />
              </Form>
            </Col>
          </Row>)}
        </Container>
      </div>
    );
  }
}

export default withRouter(PreUploadComponent);