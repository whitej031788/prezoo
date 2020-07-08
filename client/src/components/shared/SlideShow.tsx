import React, { Component } from "react";
import { Carousel } from 'react-bootstrap';
import './SlideShow.css';
import { IProject } from '../../interfaces/IProject';

// TypeScript, define the properties and state we expect passed to this component
interface ISlideShowProps {
  project?: IProject
};

interface ISlideShowState {};

export default class LoadingLeaf extends Component<ISlideShowProps, ISlideShowState> {
  constructor(props: ISlideShowProps) {
    super(props);
  }

  render() {
    let el = null;
    
    if (this.props.project) {
      const presentationSlides = this.props.project.Slides.map((slide: any, k: Number) => {
        return (
          <Carousel.Item key={slide.id}>
            <img
              src={process.env.REACT_APP_ASSET_URL + slide.fileName} alt="Slide" className="slide-show-img"
            />
          </Carousel.Item>
        );
      });

      el = (<Carousel data-interval="false">{presentationSlides}</Carousel>)
    }
    
    return el;
  }
}