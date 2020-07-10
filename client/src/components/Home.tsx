import React, { Component } from "react";
import { Container, Row, Card, Col, Button } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import './Home.css';
import axios from 'axios';
import { withRouter, RouteComponentProps } from "react-router-dom";
import LoadingLeaf from './shared/LoadingLeaf';

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
    // Currently we only support a single file upload
    this.setState({selectedFile: acceptedFiles[0], errorMessage: ''});
  }

  onSubmit() {
    const data = new FormData();
    if (this.state.selectedFile && this.state.selectedFile.size > 10000000) {
      this.setState({errorMessage: "Your file is over the 10MB limit. Please submit a smaller file."})
      return;
    }
    this.setState({isLoading: true});
    const blob = this.state.selectedFile as Blob;
    data.append('file', blob);
    axios.post(process.env.REACT_APP_API_URL + "/project/upload", data)
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
            <Col md={{span: 10, offset: 1}}>
              <h1 className="main-title">Presentations without the hassle</h1>
              <Col md={{span: 8, offset: 2}}>
                <p className="text-center">Control your presentations remotely as a team with collaborator notes and chat. Presenting remotely has never been so easy.</p>
              </Col>
              <Dropzone multiple={false} onDrop={this.onFileSelect}>
                {({getRootProps, getInputProps}) => (
                  <Col md={{span: 8, offset: 2}} sm="12" className="text-center">
                    <section className="dropzone cta-prezoo-button">
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {this.state.errorMessage && (
                          <Col md="12" className="alert-danger mb-2 p-2">{this.state.errorMessage}</Col>
                        )}
                        <div><img src="/images/upload.png" alt="Upload" className="brand-logo" />Upload your first finished project</div>
                      </div>
                    </section>
                    <div className="small-text mt-1">PDF files only</div>
                  </Col>
                )}
              </Dropzone>
              <LoadingLeaf isLoading={this.state.isLoading} />
              {this.state.selectedFile && (
                <div className="text-center">
                  <p>File name: <b>{this.state.selectedFile.name}</b></p>
                  <Button onClick={this.onSubmit}>Create Project</Button>
                </div>
              )}
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