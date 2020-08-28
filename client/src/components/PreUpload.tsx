import React, { Component } from "react";
import { Container, Row, Col, Form } from 'react-bootstrap';
import './PreUpload.css';
import { IProject } from '../interfaces/IProject';
import SlideShow from './shared/SlideShow';
import CopyText from './shared/CopyText';
import { withRouter, RouteComponentProps } from "react-router-dom";
import ButtonLoader from './shared/ButtonLoader';
import ProjectService from '../services/projectService';
import { connect } from 'react-redux';
import { receiveUser}  from '../actions/userActions';

// TypeScript, define the properties and state we expect passed to this component
interface IPreUploadProps extends RouteComponentProps {
  guid: string,
  dispatch: any
};

interface IPreUploadState {
  isLoading: boolean,
  project?: IProject,
  projectName: string,
  ownerName: string,
  ownerEmail: string,
  validated: boolean,
  collabCode: string,
  localSlideNumber: number,
  nextPage: string
};

class PreUploadComponent extends Component<IPreUploadProps, IPreUploadState> {
  constructor(props: IPreUploadProps) {
    super(props);
    this.state = { 
      isLoading: false,
      project: undefined,
      collabCode: '',
      projectName: '',
      ownerName: '',
      ownerEmail: '',
      validated: false,
      localSlideNumber: 0,
      nextPage: 'preview'
    };

    this.handleChange = this.handleChange.bind(this);
    this.submitPreview = this.submitPreview.bind(this);
    this.goToEdit = this.goToEdit.bind(this);
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
        project: res.data.project,
        collabCode: res.data.presentation.collabCode,
        projectName: res.data.project.projectName ? res.data.project.projectName : '',
        ownerName: res.data.project.ownerName ? res.data.project.ownerName : '',
        ownerEmail: res.data.project.ownerEmail ? res.data.project.ownerEmail : ''
      });
    }).catch(err => {
      console.log(err);
    })
  }

  goToEdit(event: React.MouseEvent) {
    event.preventDefault();
    this.setState({nextPage: "edit"}, () => {this.submitPreview(undefined)});
  }

  submitPreview = (event: React.FormEvent<HTMLFormElement> | undefined): void => {
    if (event) {
      event.preventDefault();
    }

    const form = document.querySelector("form") as HTMLFormElement;
  
    // It really shouldn't be undefined, but this Typescript is doing my head in
    let projectId = this.state.project ? this.state.project.id : 0;

    if (form.checkValidity() === false) {
      if (event) {
        event.stopPropagation();
      }
    } else {
      this.setState({isLoading: true});
      ProjectService.updateProject(projectId, {
        projectName: this.state.projectName,
        ownerName: this.state.ownerName,
        ownerEmail: this.state.ownerEmail
      })
      .then(res => {
        this.props.dispatch(receiveUser(this.state.ownerName));
        let redirectUrl = "/pre-prezoo/" + this.state.nextPage + "/" + this.props.guid;
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
          <h1 className="route-title mb-4">Project Upload</h1>
          {this.state.project && (
          <Row>
            <Col md="8" className="text-center">
              <SlideShow onSlideSelect={(index: number) => this.setState({localSlideNumber: index})} slideNumber={this.state.localSlideNumber} styles={{height: '350px'}} project={this.state.project} showControls={true} />
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
                <Row>
                  <Col md="6">
                    <ButtonLoader name="preview" text="Preview" isLoading={this.state.isLoading} isSubmit={true} />
                  </Col>
                  <Col md="6">
                    <ButtonLoader name="edit" text="Edit" isLoading={this.state.isLoading} isSubmit={false} onClick={this.goToEdit} />
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>)}
        </Container>
      </div>
    );
  }
}

export default connect()(withRouter(PreUploadComponent));