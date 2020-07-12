import React, { Component } from "react";
import { Carousel, Button } from 'react-bootstrap';
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

      let classesToApply = "";

      if (this.props.isFullScreen) {
        classesToApply = "carouselWrapper full-screen-center";
      } else {
        classesToApply = "carouselWrapper";
      }

      let showButton = !this.props.isFullScreen && this.props.isAttendeeView;

      el = (
        <div className={classesToApply} style={this.props.styles ? this.props.styles : undefined}>
          <Carousel 
            onSelect={this.onSlideSelect} 
            controls={this.props.showControls} 
            slide={false} interval={null} 
            activeIndex={this.props.slideNumber}
          >
            {presentationSlides}
          </Carousel>
          {showButton && (<Button onClick={this.props.goFullScreen} className="mr-1 mb-1" style={{display: 'inline', position: 'absolute', bottom: '0', right: '0'}} type="button">Full screen &gt;</Button>)}
        </div>)
    }
    
    return el;
  }
}

export default SlideShow;