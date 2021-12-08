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
  this.handleDeletePath = this.handleDeletePath.bind(this)
}
  componentDidMount() {
    datab.collection('path').where('user','==', this.state.user.uid).get().then(querySnapshot => {
      let allPosts = [];
      querySnapshot.forEach(doc => {
        var docData = {eduList: doc.data().eduList, carList: doc.data().carList, docId: doc.id}
        allPosts.push(docData)
      })
      console.log(allPosts)
      this.setState({posts: allPosts})
    });
  }
  handleDeletePath(event){
    var _this = this;
    console.log("this was called");
    var docId = event.target.value
    var query = datab.collection('path').where('user','==', this.state.user.uid);
    query.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if(doc.id==docId)
        {
          doc.ref.delete();
        }
      });
    }).then(function(){
      _this.componentDidMount();
    })
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
          <button onClick={this.handleDeletePath} value={n.docId}>Delete</button>
        </div>
      ))}
      </Container>
    </div>
  );
}
}