import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab} from "../services/firebase";
import {EduBox, CarBox} from './Box';
import {Button, Container, Table, Row, Col} from 'react-bootstrap';
import UpdateFilter from "../components/Functions2";

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
    myPaths: [{details:[]}, {details:[]}, {details:[]}, {details:[]}, {details:[]}, {details: []}, {details: []}, {details: []}],
    groupedPosts: this.props.groupedPosts,
    authenticated: false
  }
  this.onChangeCheckBox = this.onChangeCheckBox.bind(this);
  this.handleUpdate = this.handleUpdate.bind(this);
  this.filterNextById= this.filterNextById.bind(this);
}

componentDidMount() {
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
  if(this.props.showPlanUpdater)
  {
    UpdateFilter(gp, qualification, industry);
    this.setState({ groupedPosts: gp });
  }
}

handleUpdate(e) {
  try{
    if (this.state.user) {
    var uid = this.state.user.uid
    var myPaths = this.state.myPaths
    var myPaths=this.removeDeletedPlans(this.state.myPaths, this.state.groupedPosts);
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
  for(var i=0; i<paths.length; i++){
    var levels=paths[i].details
    for(var j=0; j<levels.length; j++){
      var result = undefined
      if(grouped.length>i){
        var result = grouped[i].find(groupObj => {
            return groupObj.id === levels[j].id;
        })
      }
      if(result==undefined)
      {
        paths[i].details.splice(j, 1);
      }
    }
  }
  return paths;
}

onChangeCheckBox(event){
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
  var pos=-1
  for(var j=0; j<myPaths[index].details.length; j++ )
  {
    if(id==myPaths[index].details[j].id)
    {
      pos=j
      break
    }
  }
  if (pos==-1) {
    myPaths[index].details.push(enter)
  }
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
  filterNextById(id) {
    var myPaths = this.state.groupedPosts
    for(var iter=0; iter<myPaths.length; iter++)
    {
      var result = myPaths[iter].find(groupObj => {
        return groupObj.id === id;
      })
      if(result!=undefined)
      {
        if((this.props.allSelected || result.currentUser) && (this.props.showPlanUpdater|| result.filterMatch))
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
      <Row className="center">
        <Col><Button className="button" onClick={this.handleUpdate}>Update Path Planner</Button>
        </Col>
        <Col>
        <h4>Select to add to planner</h4>
        </Col>
      </Row>
      )}
        <table>
            <tbody>
      <tr>
          {this.state.groupedPosts && this.state.groupedPosts.map((n,index) => (
          <td key={index}>  
            {n && n.map((o,i) => (
              ((this.props.allSelected || o.currentUser) && (this.props.showPlanUpdater || o.filterMatch)) && (
            <div key={i} className="map mapNavy">
              {this.props.showPlanUpdater && (<input className="checkbox" label="include planner" type="checkbox" name={index} value={o.id} checked={this.filterEduById(o.id, index)} onChange={this.onChangeCheckBox}/>)}
              {o.education && (
              <div><EduBox box={o} />
              </div>
              )}
              {o.education===false && (
              <div><CarBox box={o} />
              </div>)}
              {o.nextItem && o.nextItem.map((nextIt,j)=> (
              <div key={j}>
              {(this.filterNextById(nextIt.id)) && 
              (<Xarrow color={colourArray[Math.floor(Math.random() * colourArray.length)]} className="arrow" start={o.id} end={nextIt.id} />)}
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