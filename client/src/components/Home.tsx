import React, { Component } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import './Home.css';
import { withRouter, RouteComponentProps } from "react-router-dom";
import LoadingGif from './shared/LoadingGif';
import ProjectService from '../services/projectService';

// TypeScript, define the properties and state we expect passed to this component
type IHomeProps = RouteComponentProps;

interface IHomeState {
  selectedFile?: File,
  errorMessage: string,
  isLoading: Boolean
};

class HomeComponent extends Component<IHomeProps, IHomeState> {

  constructor(props: IHomeProps) {
    super(props);
    this.state = { selectedFile: undefined, errorMessage: '', isLoading: false };

    this.onFileSelect = this.onFileSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onFileSelect(acceptedFiles: File[]) {
    let self = this;
    // Currently we only support a single file upload
    this.setState({selectedFile: acceptedFiles[0], errorMessage: ''}, function() {
      self.onSubmit();
    });
  }

  onSubmit() {
    const data = new FormData();

    if (!this.state.selectedFile || !this.state.selectedFile.name) {
      this.setState({errorMessage: "Please select a file first"});
      return;
    }

    let fileName = this.state.selectedFile.name;

    if (this.state.selectedFile && this.state.selectedFile.size > 10000000) {
      this.setState({errorMessage: "Your file is over the 10MB limit. Please submit a smaller file."})
      return;
    }

    let fileExt = fileName.split('.').pop();

    if (fileExt !== 'pdf') {
      this.setState({errorMessage: "Please save your presentation as a PDF file and upload it."})
      return;   
    }

    this.setState({isLoading: true});
    const blob = this.state.selectedFile as Blob;
    data.append('file', blob);

    ProjectService.projectUpload(data)
    .then(res => {
      this.setState({isLoading: false});
      let redirectUrl = "/pre-prezoo/upload/" + res.data.projectGuid;
      this.props.history.push(redirectUrl);
    }).catch(err => {
      this.setState({isLoading: false});
      console.log(err);
    })
  }

  render() {
    return (
      <Container className="fill-home-screen" fluid>
        <Row>
          <Container className="p-5">
            <Col md={{span: 10, offset: 1}} xs="12">
              <h1 className="main-title">Presentations without the hassle</h1>
              <Col md={{span: 8, offset: 2}} xs="12">
                <p className="text-center">Control your presentations remotely as a team with collaborator notes and chat. Presenting remotely has never been so easy.</p>
              </Col>
              {this.state.errorMessage && (
                <Col md={{span: 8, offset: 2}} xs="12" className="alert-danger mb-2 p-2 text-center">{this.state.errorMessage}</Col>
              )}
              <Dropzone multiple={false} onDrop={this.onFileSelect}>
                {({getRootProps, getInputProps}) => (
                  <Col md={{span: 8, offset: 2}} sm="12" className="text-center">
                    <section className="dropzone cta-prezoo-button">
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div>
                          <LoadingGif isLoading={this.state.isLoading} />
                          {!this.state.isLoading && (<div><img src="/images/upload.png" alt="Upload" className="brand-logo" /><span>Upload your first finished project</span></div>)}
                        </div>
                      </div>
                    </section>
                    <div className="small-text mt-1">PDF files only</div>
                  </Col>
                )}
              </Dropzone>
              <Col md="12" className="mt-4 backgroundImagePresent">
              </Col>
              <Col md={{span: 8, offset: 2}} className="mt-3">
                <p className="text-center" style={{fontStyle: 'italic'}}>“We should just stop calling these things presentations altogether. Everyone gets hung up on that word. Wouldn’t it be easier to just call them conversations? That’s really what they are.”</p>
              </Col>
            </Col>
          </Container>
        </Row>
      </Container>
    );
  }
}

export default withRouter(HomeComponent);