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
      <Container className="fill" fluid>
        <Row>
          <Container className="p-5">
            <Col md={{ span: 10, offset: 1 }}>
              <Card className="my-5">
                <Card.Body className="p-5">
                  <h2 className="font-weight-light text-center">Present without the hassle</h2>
                  <p className="lead text-center mb-5">Control your presentations remotely as a team</p>
                  <Dropzone multiple={false} onDrop={this.onFileSelect}>
                    {({getRootProps, getInputProps}) => (
                      <section className="dropzone">
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          {this.state.errorMessage && (
                            <Col md="12" className="alert-danger mb-2 p-2">{this.state.errorMessage}</Col>
                          )}
                          <p>Upload your first finished project...</p>
                          <p className="pb-0 mb-0"><img src="/images/upload.png" alt="Upload" className="brand-logo" /> or drag and drop any project</p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  <LoadingLeaf isLoading={this.state.isLoading} />
                  {this.state.selectedFile && (
                    <div className="text-center">
                      <p>File name: <b>{this.state.selectedFile.name}</b></p>
                      <Button onClick={this.onSubmit}>Create Project</Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Container>
        </Row>
      </Container>
    );
  }
}

export default withRouter(HomeComponent);