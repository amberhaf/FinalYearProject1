import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab} from "../services/firebase";
import {EduBox, CarBox} from './Box';
import {Button, Container, Table, Row, Col} from 'react-bootstrap';
import Updatefilter from "../components/Updatefilter";

const colourArray = ['#d4afb9', '#ffd670', '#d1cfe2', 
'#9cadce', '#7ec4cf', '#52b2cf','#79addc', '#ffc09f', 
'#ffee93', '#adf7b6','#84dcc6', '#a5ffd6', '#ffa69e', 
'#ff686b', '#f6bc66','#ff7477', '#e69597', '#ceb5b7', 
'#b5d6d6', '#9cf6f6','#f6ac69', '#fdffb6', '#ff9770']

export default class Map extends Component {
constructor(props) {
  super(props);
  this.state = {
    user: auth().currentUser,
    pos: 0,
    qualification: this.props.qualification,
    industry: this.props.industry,
    //describes the paths you've added to the planner
    myPaths: [{details:[]}, {details:[]}, {details:[]}, {details:[]}, {details:[]}, {details: []}, {details: []}, {details: []}],
    //describes all the paths formated in a way we can display
    groupedPosts: this.props.groupedPosts,
    authenticated: false
  }
  this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
  this.handleUpdate = this.handleUpdate.bind(this);
  this.filterNextEduById= this.filterNextEduById.bind(this);
}

componentDidMount() {
  //if user is logged in tick all paths that are save in planner
  if (this.state.user) {
    this.setState({authenticated: true})
    datab.collection('pathPlans').where('user','==', this.state.user.uid).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({myPaths: doc.data().list})
      })
    });
  }
  var qualification=this.state.qualification;
  var industry=this.state.industry;
  var gp= this.state.groupedPosts;
  //only display objects that stem from objects that match the dropdown
  Updatefilter(gp, qualification, industry);
  this.setState({ groupedPosts: gp });
}

handleUpdate(e) {
  try{
    if (this.state.user) {
    var uid = this.state.user.uid
    //remove any myPaths that user has saved but have since been deleted from pathsIntertwined
    var myPaths=this.removeDeletedPlans(this.state.myPaths, this.state.groupedPosts);
    //if user has a pathPlan already update it with new list
    datab.collection('pathPlans').where("user", "==", uid)
    .get()
    .then(function(querySnapshot) {
      if(querySnapshot.docs.length>0)
      {
        querySnapshot.forEach(function(doc) {
          doc.ref.update({
            user: uid,
            list: myPaths})
        });       
      }
      //if user doesn't have a pathPlan update it 
      else{
        datab.collection("pathPlans").add({
        user: uid,
        list: myPaths
      });
      }
  })
  window.alert("Successfully updated paths");
  }
  }
  catch(error)
  {
    window.alert("Error occurred"+ error.message );
  }
}

removeDeletedPlans(paths, grouped){
  //loop through all the myPaths and make sure all still exist in groupedPosts
  for(var i=0; i<paths.length; i++){
    var levels=paths[i].details
    for(var j=0; j<levels.length; j++){
      var result = undefined
      //check if we can find in groupPosts
      if(grouped.length>i){
        var result = grouped[i].find(groupObj => {
            return groupObj.id === levels[j].id;
        })
      }
      //if they don't exist delete
      if(result==undefined)
      {
        paths[i].details.splice(j, 1);
      }
    }
  }
  return paths;
}

onChangeCheckBox(event){
  //when a checkbox is changed find it's id's location in grouped posts
  var myPaths=this.state.myPaths
  var id=event.target.value
  var index = event.target.name
  var gp=this.state.groupedPosts
  var enter = []
  for(var j=0; j<gp[index].length; j++ )
  {
    if(id==gp[index][j].id)
    {
      enter=gp[index][j]
      break
    }
  }
  //find the corresponding location in myPaths if it exists there
  var pos=-1
  for(var j=0; j<myPaths[index].details.length; j++ )
  {
    if(id==myPaths[index].details[j].id)
    {
      pos=j
      break
    }
  }
  //if it doesn't exist in myPaths add it 
  if (pos==-1) {
    myPaths[index].details.push(enter)
  }
  //if it does exist in myPaths remove it
  else{
    myPaths[index].details.splice(pos, 1);
  }
  this.setState({myPaths: myPaths})
}

  filterEduById(id, index) {
    var myPaths = this.state.myPaths
    if(myPaths.length>index){
    var result = myPaths[index].details.find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterNextEduById(id) {
    var myPaths = this.state.groupedPosts
    //see if where the arrow is pointing actually exists in groupPosts
    for(var iter=0; iter<myPaths.length; iter++)
    {
      var result = myPaths[iter].find(groupObj => {
        return groupObj.id === id;
      })
      if(result!=undefined)
      {
        if((this.props.allSelected || result.currentUser) && result.filterMatch)
        {
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
          {this.state.groupedPosts && this.state.groupedPosts.map((n,index) => (
          <td key={index}>  
            {n && n.map((o,i) => (
              //display based on if we want all paths or if it matches filtering applied
              ((this.props.allSelected || o.currentUser) && (o.filterMatch)) && (
            <div key={i} className="map mapNavy">
              {this.props.showPlanUpdater && (
                <div>
              <input className="checkbox" label="include planner" type="checkbox"
              name={index} value={o.id} checked={this.filterEduById(o.id, index)} 
              onChange={this.onChangeCheckBox}/>
              <label className="white textRight"> Saved in Planner </label></div> )}
              {o.education && (
              //check if education object
              <div><EduBox box={o} />
              </div>)}
              {!o.education && (
              //check if career object
              <div><CarBox box={o} />
              </div>)}
              <div id={o.id+"_start"} className="start"></div>
              {o.nextItem && o.nextItem.map((nextIt,j)=> (
              <div key={j}>
              {(this.filterNextEduById(nextIt.id)) && 
              //check if arrow is pointing to a valid object
              (<Xarrow color={colourArray[i % colourArray.length]} className="arrow" start={o.id+"_start"} end={nextIt.id+"_end"}/>)}
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