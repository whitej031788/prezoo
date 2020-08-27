import React, { Component } from "react";
import { Container, Row,  Col } from 'react-bootstrap';


class AboutUs extends Component {
  render() {
    return (
      <Container className="fill-home-screen" fluid>
        <Row>
          <Container className="p-5">
            <Col md={{span: 10, offset: 1}}>
              <h1 className="main-title">About Us</h1>
            </Col>
            <br></br>
            <Col md={{span: 12, offset: 0}} xs="12">
                <p className="text-center sub-text">For those of us not accustomed to remote work, 2020 has taught us how exhausting it is to spend all day video conferencing. Often, we're struggling to get basic things done and keep people as engaged as we did when back in the office.</p>
                <p className="text-center sub-text">For the Prezoo team, this project started after a product showcase where the words “can you see my screen?” and “next slide, please” were getting used far too often. It didn't take long for us to uncover an endless list of pains felt across sales people, educators, leadership, talent teams + more. Why was it with that despite the rocketing popularity of video conferencing tools do presentations suck?</p>
                <p className="text-center sub-text">To us, it became obvious that the majority of presentation tools have been made for in-person meetings and are not suited to the evolving needs of remote collaboration. It was also obvious there are ALOT of tools for creating presentations and seemingly EVERYONE has a different preference. A salesperson is unlikely to want to spend time getting to know Figma while a designer would most likely resign if forced to use GSlides.</p>
                <p className="text-center sub-text">So, we built the world's first cross-platform remote delivery tool for presentations! The tool itself will be free forever, there are no downloads, you don't even need to sign up right now, just use it and tell us what you think.</p>
            </Col>
            <br></br>
            <Col md={{span: 10, offset: 1}}>
              <h3 className="main-title">The Home of Finished Work</h3>
            </Col>
            <Col md={{span: 12, offset: 0}} xs="12">
                <p className="text-center sub-text">Finished work should be cherished and remembered, not dropped into the abyss that is Google Drive or Dropbox or even slack. We want to be the number one platform for delivering and storing finished work. Unlike other presentations tools focusing heavily on creation, we're all about delivery and impact, including what happens after, so individuals and companies alike can strive for continuous improvement.</p>
                <p className="text-center sub-text">While we're in Beta, we plan to collect as much feedback as possible to inform how we help you deliver, and when we have that down we're planning to launch logins and the ability to save your presentations for future use and have a variety of ideas around discussion boards, product feedback loops and training/onboarding... but we need you to tell us what YOU want. Give us a test run or deliver your first project today using Prezoo and let us know what you think!</p>
            </Col>
          </Container>
        </Row>
      </Container>
    );
  }
}

export default AboutUs;