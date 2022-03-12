import React, { useRef, Component } from 'react';
import { auth, datab } from "../services/firebase";
import { EduBox, CarBox } from './Box';
import { Container, Row, Col } from 'react-bootstrap';

export default class MyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      posts: [{ list: [] }],
    }
    this.handleDeletePath = this.handleDeletePath.bind(this)
  }
  componentDidMount() {
    //retrieve all the paths in database where user id matches the current user
    datab.collection('path').where('user', '==', this.state.user.uid).get().then(querySnapshot => {
      let allPosts = [];
      querySnapshot.forEach(doc => {
        var docData = { list: doc.data().list, docId: doc.id }
        allPosts.push(docData)
      })
      this.setState({ posts: allPosts })
    });
  }
  handleDeletePath(event) {
    var _this = this;
    var docId = event.target.value
    //find the path your referencing in database where user id matching the current user
    var query = datab.collection('path').where('user', '==', this.state.user.uid);
    query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (doc.id == docId) {
          //delete this path
          doc.ref.delete();
        }
      });
    }).then(function () {
      _this.componentDidMount();
    })
  }

  render() {
    return (
      <div className='section'>
        <p className="text-center">
          Uploaded Paths for <b>{this.state.user.email}</b>
        </p>
        <Container>
          {this.state.posts && this.state.posts.map((n, index) => (
            <div key={index}>
              <Row>
                {n.list && n.list.map((o, i) => (
                  <Col key={i}>
                    {o.education && (
                      //check if education object
                      <div className="myMap mapPurple">
                        <EduBox box={o} />
                      </div>
                    )}
                    {!o.education && (
                      //check if career object
                      <div className="myMap mapBlue">
                        <CarBox box={o} />
                      </div>
                    )}
                  </Col>
                ))}
              </Row>
              <button className="greyButton" onClick={this.handleDeletePath} value={n.docId}>Delete</button>
            </div>
          ))}
        </Container>
      </div>
    );
  }
}