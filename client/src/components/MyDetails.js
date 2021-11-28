import React, { useRef, Component } from 'react';
import { auth, datab} from "../services/firebase";
import {EduBox, CarBox} from './Box';
import {Container, Row, Col} from 'react-bootstrap';

export default class MyDetails extends Component {
constructor(props) {
  super(props);
  this.state = {
    user: auth().currentUser,
    posts: [{eduList:[]}, {carList:[]}],
  }
}
  componentDidMount() {
    datab.collection('path').where('user','==', this.state.user.uid).get().then(querySnapshot => {
      let allPosts = [];
      querySnapshot.forEach(doc => {
        allPosts.push(doc.data())
      })
      console.log(allPosts)
      this.setState({posts: allPosts})
    });
  }

  render() {
  return (
    <div>
      <Container>
      {this.state.posts && this.state.posts.map((n,index) => (
        <div key={index}>  
        <Row>
        {n.eduList && n.eduList.map((o,i) => (
          <div key={i} className="myMap">
            <EduBox box={o} />
          </div>
          ))}
          {n.carList && n.carList.map((o,i) => (
          <div key={i} className="myMap">
            <CarBox box={o} />
          </div>
          ))}
          </Row>
          <button>Delete</button>
        </div>
      ))}
      </Container>
    </div>
  );
}
}