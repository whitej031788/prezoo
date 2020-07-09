import React, { Component } from "react";
import { Carousel } from 'react-bootstrap';
import { connect } from 'react-redux';
import './SlideShow.css';
import { IProject } from '../../interfaces/IProject';

// TypeScript, define the properties and state we expect passed to this component
interface ISlideShowProps {
  project?: IProject,
  slideNumber: number,
  showControls: boolean
};

interface ISlideShowState {
  slideNumber: number
};

class SlideShow extends Component<ISlideShowProps, ISlideShowState> {
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
          <Carousel controls={this.props.showControls} slide={false} interval={null} activeIndex={this.props.slideNumber}>
            {presentationSlides}
          </Carousel>
        </div>)
    }
    
    return el;
  }
}

const mapStateToProps = (state: ISlideShowState) => ({
  slideNumber: state.slideNumber
});

export default connect(mapStateToProps)(SlideShow);