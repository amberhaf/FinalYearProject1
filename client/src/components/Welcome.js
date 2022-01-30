import React, { Component } from "react";
import {Container, Table, Row, Col} from 'react-bootstrap'

export default class Welcome extends Component {

  render() {
    return (
      <div className="section">
          <Container className="center">
          <Row>
          <Col className="welcome">
          <h1><b>Path Mapper</b></h1>
          <h2>Visualize your career plan</h2> 
          </Col>
          <Col className="col2">
          <img src="CareerPath.png"/>
          </Col>
          </Row>
          </Container>
      </div>
    );
  }
}
