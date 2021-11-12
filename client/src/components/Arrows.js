import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';


const boxStyle = {
  border: '1px #999 solid',
  borderRadius: '10px',
  textAlign: 'center',
  width: '100px',
  height: '30px',
  color: 'black',
};
const right = {
  float: 'right'
};

const Box = (props) => {
  return (
    <div id={props.box.id} style={boxStyle}>
      {props.box.id}
    </div>
  );
};
export default class Arrows extends Component {
constructor(props) {
  super(props);
  this.state = {
    box1 : { id: 'box1' },
    box2 : { id: 'box2' },
    box3 : { id: 'box3' }
  };
  }
  render() {
  return (
    <div>
      <React.Fragment>
        <Box box={this.state.box2} />
        <h3>
          <u>Simple Example:</u>
        </h3>
        <Box style={right} box={this.state.box1}/>
        <h1>AAHHHHHH</h1> <Box box={this.state.box3} />
          <Xarrow start={this.state.box1.id} end={this.state.box3.id}/>
          <Xarrow start={this.state.box2.id} end={this.state.box3.id}/>
      </React.Fragment>
    </div>
  );
}
}