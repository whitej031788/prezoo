import React, { Component } from 'react';
import './CopyText.css';

interface ICopyTextProps {
  theText: string
};

interface ICopyTextState {
  theStatus: string
};

export default class CopyText extends Component<ICopyTextProps, ICopyTextState> {
  constructor(props: ICopyTextProps) {
    super(props);

    this.state = {
      theStatus: 'Copy'
    }

    this.copyTheText = this.copyTheText.bind(this);
  }

    copyTheText() {
      let self = this;
      const el = document.createElement('textarea');
      el.value = this.props.theText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.setState({theStatus: 'Copied!'}, () => {
        setTimeout(function() {
          self.setState({theStatus: 'Copy'});
        }, 1500);
      });
    }

    render() {
      return (
        <div className="copyText" onClick={this.copyTheText}>&nbsp;{this.state.theStatus}</div>
      )
    }
}