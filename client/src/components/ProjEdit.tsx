import React, { Component } from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { IProject } from '../interfaces/IProject';
import SlideShow from './shared/SlideShow';
import ProjectService from '../services/projectService';
import { withRouter, RouteComponentProps } from "react-router-dom";

// TypeScript, define the properties and state we expect passed to this component
interface IProjEditProps extends RouteComponentProps {
  guid: string
};

interface IProjEditState {
  isLoading: boolean,
  project?: IProject,
  projectName: string,
  ownerName: string,
  ownerEmail: string,
  validated: boolean,
  localSlideNumber: number
};

class ProjEdit extends Component<IProjEditProps, IProjEditState> {
  constructor(props: IProjEditProps) {
    super(props);
    this.state = { 
      isLoading: false,
      project: undefined,
      projectName: '',
      ownerName: '',
      ownerEmail: '',
      validated: false,
      localSlideNumber: 0
    };

    this.handleChange = this.handleChange.bind(this);
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
        projectName: res.data.project.projectName ? res.data.project.projectName : '',
        ownerName: res.data.project.ownerName ? res.data.project.ownerName : '',
        ownerEmail: res.data.project.ownerEmail ? res.data.project.ownerEmail : ''
      });
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <div className="component-root">
        <Container>
          <h1 className="route-title">Project Edit</h1>
          {this.state.project && (
          <Row>
            <Col md="8" className="text-center">
              <SlideShow onSlideSelect={(index: number) => this.setState({localSlideNumber: index})} slideNumber={this.state.localSlideNumber} styles={{height: '350px'}} project={this.state.project} showControls={true} />
            </Col>
            <Col md="4">
              <h2 className="text-center">Coming Soon</h2>
              <Button onClick={() => this.props.history.goBack()}>Back</Button>
            </Col>
          </Row>)}
        </Container>
      </div>
    );
  }
}

export default withRouter(ProjEdit);