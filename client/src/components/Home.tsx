import React, { Component } from "react";
import { Container, Row, Card, Col, Button } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import './Home.css';
import axios from 'axios';

// TypeScript, define the properties and state we expect passed to this component
interface IHomeProps {};

interface IHomeState {
  selectedFile?: File,
  errorMessage: String
};

export default class Home extends Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);
    this.state = { selectedFile: undefined, errorMessage: '' };

    this.onFileSelect = this.onFileSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onFileSelect(acceptedFiles: File[]) {
    console.log(acceptedFiles);
    // Currently we only support a single file upload
    this.setState({selectedFile: acceptedFiles[0], errorMessage: ''});
  }

  onSubmit() {
    const data = new FormData();
    if (this.state.selectedFile && this.state.selectedFile.size > 10000000) {
      this.setState({errorMessage: "Your file is over the 10MB limit. Please submit a smaller file."})
      return;
    }
    const blob = this.state.selectedFile as Blob;
    data.append('file', blob);
    axios.post("http://localhost:3001/api/project/upload", data, { // receive two parameter endpoint url ,form data 
    })
    .then(res => { // then print response status
      console.log(res);
      //window.location.href = "/pre-prezoo/upload/" + res.data.projectGuid;
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div className="component-root">
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
                            <p className="pb-0 mb-0"><img src="/images/upload.png" className="brand-logo" /> or drag and drop any project</p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
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
      </div>
    );
  }
}