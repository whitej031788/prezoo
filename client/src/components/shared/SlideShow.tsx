import React, { Component } from "react";
import { Carousel } from 'react-bootstrap';
import './SlideShow.css';
import { IProject } from '../../interfaces/IProject';

// TypeScript, define the properties and state we expect passed to this component
interface ISlideShowProps {
  project?: IProject,
  slideNumber?: number,
  showControls: boolean,
  onSlideSelect?: Function,
  styles?: object,
  isFullScreen?: boolean,
  isAttendeeView?: boolean,
  goFullScreen?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
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

  onIndicatorClick(index: Number) {
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

      const slideIndicators = this.props.project.Slides.map((slide: any, k: Number) => {
        let activeClass = undefined;
        if (k === this.props.slideNumber) {
          activeClass = "active";
        }
        return (
          <li draggable={true} key={slide.id} onClick={() => this.onIndicatorClick(k)} className={activeClass} data-target='#carousel-custom' data-slide-to={k}><img src={process.env.REACT_APP_ASSET_URL + slide.fileName} alt='' /></li>
        );
      });

      let classesToApply = "";

      if (this.props.isFullScreen) {
        classesToApply = "carouselWrapper full-screen-center";
      } else {
        classesToApply = "carouselWrapper";
      }

      el = (
        <div>
          <div className={classesToApply} style={this.props.styles ? this.props.styles : undefined}>
            <Carousel 
              onSelect={this.onSlideSelect} 
              controls={this.props.showControls} 
              slide={false} interval={null} 
              activeIndex={this.props.slideNumber}
              indicators={false}
              wrap={false}
              id="carousel-custom"
            >
              {presentationSlides}
            </Carousel>
          </div>
          {this.props.showControls && (<ol className="prezoo-carousel-indicators">{slideIndicators}</ol>)}
        </div>)
    }
    
    return el;
  }
}

export default SlideShow;