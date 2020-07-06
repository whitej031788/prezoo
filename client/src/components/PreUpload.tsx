import React, { Component } from "react";
import { Container, Row, Col, Button, Carousel } from 'react-bootstrap';
import './PreUpload.css';
import axios from 'axios';

// TypeScript, define the properties and state we expect passed to this component
interface IPreUploadProps {
  guid: String
};

interface IPreUploadState {
  isLoaded: Boolean,
  project: any
};

export default class PreUpload extends Component<IPreUploadProps, IPreUploadState> {
  constructor(props: IPreUploadProps) {
    super(props);
    this.state = { 
      isLoaded: false,
      project: {Slides: []}
    };
  }

  componentWillMount() {
    this.getSlides();
  }

  getSlides() {
    axios.get("http://localhost:3001/api/project/slides/" + this.props.guid)
    .then(res => { // then print response status
      this.setState({project: res.data});
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    const presentationSlides = this.state.project.Slides.map((slide: any, k: Number) => {
      // FIX THIS
      var imagePath = "";
      if (slide && slide.file_path)
        imagePath = "http://localhost:3001/" + slide.file_path.replace('public/', '');

      console.log(imagePath)

      return (
        <Carousel.Item key={slide.id}>
          <img
            className="d-block w-100"
            src={imagePath}
          />
        </Carousel.Item>
      );
    });
    return (
      <div className="component-root">
        <Container>
          <Row>
            <Col md="12">
              <p>Actions</p>
              <li>
                <ul>Test</ul>
              </li>
            </Col>
          </Row>
          <Row>
            <Col md="5">
              <Carousel>
                {presentationSlides}
              </Carousel>
            </Col>
            <Col md="7">
              <p>Your project name</p>
              <p>Your email</p>
              <p>share this link and code</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}