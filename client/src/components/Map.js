import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab } from "../services/firebase";
import { EduBox, CarBox } from './Box';
import { Button, Container, Row, Col } from 'react-bootstrap'
import UpdateFilter from "./Updatefilter";

//used to change the colour of arrows depending on what level they're on
const colourArray = ['#d4afb9', '#ffd670', '#d1cfe2',
  '#9cadce', '#7ec4cf', '#52b2cf', '#79addc', '#ffc09f',
  '#ffee93', '#adf7b6', '#84dcc6', '#a5ffd6', '#ffa69e',
  '#ff686b', '#f6bc66', '#ff7477', '#e69597', '#ceb5b7',
  '#b5d6d6', '#9cf6f6', '#f6ac69', '#fdffb6', '#ff9770']

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      industry: "",
      qualification: "",
      pos: 0,
      //describes the paths you've added to the planner
      myPaths: [{ details: [] }, { details: [] }, { details: [] }, { details: [] }, { details: [] }, { details: [] }, { details: [] }, { details: [] }],
      //describes all the paths formated in a way we can display
      groupedPosts: this.props.groupedPosts,
      authenticated: false
    }
    this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.currentUserMatch = this.currentUserMatch.bind(this);
    this.filterNextById = this.filterNextById.bind(this);
  }

  componentDidMount() {
    //if user is logged in tick all paths that are save in planner
    if (this.state.user) {
      this.setState({ authenticated: true })
      datab.collection('pathPlans').where('user', '==', this.state.user.uid).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({ myPaths: doc.data().list })
        })
      });
    }
    if (this.props.showPlanUpdater) {
      var qualification = this.state.qualification;
      var industry = this.state.industry;
      var gp = this.state.groupedPosts;
      //only display objects that stem from objects that match the dropdown
      UpdateFilter(gp, qualification, industry);
      this.setState({ groupedPosts: gp });
    }
  }

  currentUserMatch(o) {
    return (o.currentUser)
  }

  handleUpdate(e) {
    try {
      if (this.state.user) {
        var uid = this.state.user.uid
        //remove any myPaths that user has saved but have since been deleted from pathsIntertwined
        var myPaths = this.removeDeletedPlans(this.state.myPaths, this.state.groupedPosts);
        //if user has a pathPlan already update it with new list
        datab.collection('pathPlans').where("user", "==", uid)
          .get()
          .then(function (querySnapshot) {
            if (querySnapshot.docs.length > 0) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  user: uid,
                  list: myPaths
                })
              });
            }
            //if user doesn't have a pathPlan update it 
            else {
              datab.collection("pathPlans").add({
                user: uid,
                list: myPaths
              });
            }
          })
        window.alert("Successfully updated paths");
      }
    }
    catch (error) {
      window.alert("Error occurred" + error.message);
    }
  }

  removeDeletedPlans(myPaths, grouped) {
    //loop through all the myPaths and make sure all still exist in groupedPosts
    for (var i = 0; i < myPaths.length; i++) {
      var levels = myPaths[i].details
      for (var j = 0; j < levels.length; j++) {
        var result = undefined
        //check if we can find in groupPosts
        if (grouped.length > i) {
          var result = grouped[i].find(groupObj => {
            return groupObj.id === levels[j].id;
          })
        }
        //if they don't exist delete
        if (result == undefined) {
          myPaths[i].details.splice(j, 1);
        }
      }
    }
    return myPaths;
  }
  onChangeCheckBox(event) {
    //when a checkbox is changed find it's id's location in grouped posts
    var myPaths = this.state.myPaths
    var id = event.target.value
    var index = event.target.name
    var gp = this.state.groupedPosts
    var enter = []
    for (var j = 0; j < gp[index].length; j++) {
      if (id == gp[index][j].id) {
        enter = gp[index][j]
        break
      }
    }
    //find the corresponding location in myPaths if it exists there
    var pos = -1
    for (var j = 0; j < myPaths[index].details.length; j++) {
      if (id == myPaths[index].details[j].id) {
        pos = j
        break
      }
    }
    //if it doesn't exist in myPaths add it 
    if (pos == -1) {
      myPaths[index].details.push(enter)
    }
    //if it does exist in myPaths remove it
    else {
      myPaths[index].details.splice(pos, 1);
    }
    this.setState({ myPaths: myPaths })
  }

  filterById(id, index) {
    //find if the path is already contained in myPaths
    var myPaths = this.state.myPaths
    if (myPaths.length > index) {
      var result = myPaths[index].details.find(groupObj => {
        //checkbox will be true
        return groupObj.id === id;
      })
    }
    return result != undefined
  }
  filterNextById(id) {
    //see if where the arrow is pointing actually exists in groupPosts
    var groupedPosts = this.state.groupedPosts
    for (var iter = 0; iter < groupedPosts.length; iter++) {
      var result = groupedPosts[iter].find(groupObj => {
        return groupObj.id === id;
      })
      if (result != undefined) {
        //checks if this is being displayed based on conditions
        if ((this.props.allSelected || result.currentUser) && (!this.props.showPlanUpdater || result.filterMatch)) {
          return true;
        }
      }
    }
    return false;
  }

  render() {
    return (
      <div>
        <Container>
          {this.props.showPlanUpdater && (
            //options for adding to planner should only display if user is logged on and not on bulk Path page
            <Row className="center">
              <Col>
                <h5>Tick to add to your planner</h5>
              </Col>
              <Col><Button className="button" onClick={this.handleUpdate}>Update Path Planner</Button>
              </Col>
            </Row>
          )}
          <table>
            <tbody>
              <tr>
                {this.state.groupedPosts && this.state.groupedPosts.map((n, index) => (
                  <td key={index}>
                    {n && n.map((o, i) => (
                      //display based on if we are display all paths or if there are there is filtering applied
                      ((this.props.allSelected || o.currentUser) && (!this.props.showPlanUpdater || o.filterMatch)) && (
                        <div key={i} className="map mapNavy">
                          {this.props.showPlanUpdater && (<input className="checkbox" label="include planner" type="checkbox" name={index} value={o.id} checked={this.filterById(o.id, index)} onChange={this.onChangeCheckBox} />)}
                          {o.education && (
                            //check if education object
                            <div><EduBox box={o} />
                            </div>
                          )}
                          {!o.education && (
                            //check if career object
                            <div><CarBox box={o} />
                            </div>)}
                          {o.nextItem && o.nextItem.map((nextIt, j) => (
                            <div key={j}>
                              {(this.filterNextById(nextIt.id)) &&
                                //check if arrow is pointing to a valid object
                                <Xarrow color={colourArray[i % colourArray.length]} className="arrow" start={o.id} end={nextIt.id} />}
                            </div>
                          ))}
                        </div>
                      )))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Container>
      </div>
    );
  }
}