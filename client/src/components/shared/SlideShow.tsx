import React, { Component } from "react";
import { Carousel } from 'react-bootstrap';
import './SlideShow.css';
import { IProject } from '../../interfaces/IProject';

// TypeScript, define the properties and state we expect passed to this component
interface ISlideShowProps {
  project?: IProject,
  slideNumber?: number,
  showControls: boolean,
  onSlideSelect?: Function
};

interface ISlideShowState {};

class SlideShow extends Component<ISlideShowProps, ISlideShowState> {
  constructor(props: ISlideShowProps) {
    super(props);

    this.onSlideSelect = this.onSlideSelect.bind(this);
  }

  onSlideSelect(index: number) {
    if (this.props.onSlideSelect) {
      this.props.onSlideSelect(index);
    }
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

      el = (
        <div className="carouselWrapper">
          <Carousel onSelect={this.onSlideSelect} controls={this.props.showControls} slide={false} interval={null} activeIndex={this.props.slideNumber}>
            {presentationSlides}
          </Carousel>
        </div>)
    }
    
    return el;
  }
}

export default SlideShow;