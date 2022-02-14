import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab} from "../services/firebase";
import {FilterCareer, FilterCourse} from './FilterDropDown';
import {EduBox, CarBox} from './Box';
import {Button, Container, Table, Row, Col} from 'react-bootstrap'

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
    industry: "",
    qualification: "",
    pos: 0,
    myEdus: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    myCars: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    groupedEducation: this.props.groupedEducation,
    groupedCareer: this.props.groupedCareer,
    authenticated: false
  }
  this.onChangeIndustryFilter = this.onChangeIndustryFilter.bind(this);  
  this.onChangeQualificationFilter = this.onChangeQualificationFilter.bind(this); 
  this.sortByIndustry = this.sortByIndustry.bind(this); 
  this.sortByQualification = this.sortByQualification.bind(this); 
  this.onChangeEducationCheckBox = this.onChangeEducationCheckBox.bind(this);
  this.onChangeCareerCheckBox = this.onChangeCareerCheckBox.bind(this);
  this.handleUpdate = this.handleUpdate.bind(this);
  this.currentUserMatch= this.currentUserMatch.bind(this);
}

componentDidMount() {
  if (this.state.user) {
    this.setState({authenticated: true})
    datab.collection('pathPlans').where('user','==', this.state.user.uid).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({myEdus: doc.data().eduList})
        this.setState({myCars: doc.data().carList})
      })
    });
  }
}

currentUserMatch(o){
  return (o.currentUser)
}

handleUpdate(e) {
  try{
    console.log(this.state.myEdus)
    if (this.state.user) {
    var uid = this.state.user.uid
    var myEdus = this.state.myEdus
    var myCars = this.state.myCars
    //make sure each myedus object is still contained Path map
    var myEdus=this.removeDeletedPlans(this.state.myEdus, this.state.groupedEducation);
    var myCars=this.removeDeletedPlans(this.state.myCars, this.state.groupedCareer);
    datab.collection('pathPlans').where("user", "==", uid)
    .get()
    .then(function(querySnapshot) {
      if(querySnapshot.docs.length>0)
      {
        querySnapshot.forEach(function(doc) {
          doc.ref.update({
            user: uid,
            eduList: myEdus,
            carList: myCars})
        });       
      }
      else{
        datab.collection("pathPlans").add({
        user: uid,
        eduList: myEdus,
        carList: myCars
      });
      }
  })
  window.alert("Successfully updatedjkd paths");
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
      console.log("edu plan" + levels[j].id)
      var result = undefined
      if(grouped.length>i){
        var result = grouped[i].find(groupObj => {
            return groupObj.id === levels[j].id;
        })
      }
      if(result==undefined)
      {
        console.log("Can't find item")
        paths[i].details.splice(j, 1);
      }
    }
  }
  return paths;
}
sortByIndustry(industryA, industryB) {
  let comparison = 0;
  if(this.state.industry!=""){
    if (industryA.industry == this.state.industry) comparison = -1;
    else if (industryB.industry == this.state.industry) comparison = +1;
    else comparison = 0;
  }
  return comparison;
}
sortByQualification(qualificationA, qualificationB) {
  let comparison = 0;
  if(this.state.qualification!=""){
    if (qualificationA.qualification == this.state.qualification) comparison = -1;
    else if (qualificationB.qualification == this.state.qualification) comparison = +1;
    else comparison = 0;
  }
  return comparison;
}
onChangeIndustryFilter(event) {
  this.setState({industry: event.target.value})
}
onChangeQualificationFilter(event){
  this.setState({qualification: event.target.value})
}
onChangeEducationCheckBox(event){
  var myEdus=this.state.myEdus;
  var id=event.target.value
  var index = event.target.name
  console.log(index)
  var gp=this.state.groupedEducation
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
  for(var j=0; j<myEdus[index].details.length; j++ )
  {
    if(id==myEdus[index].details[j].id)
    {
      pos=j
      break
    }
  }
  if (pos==-1) {
    myEdus[index].details.push(enter)
  }
  else{
    myEdus[index].details.splice(pos, 1);
  }
  this.setState({myEdus: myEdus})
}

onChangeCareerCheckBox(event){
  var myCars=this.state.myCars;
  var id=event.target.value
  var index = event.target.name
  console.log(index)
  var gp=this.state.groupedCareer
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
  for(var j=0; j<myCars[index].details.length; j++ )
  {
    if(id==myCars[index].details[j].id)
    {
      pos=j
      break
    }
  }
  if (pos==-1) {
    myCars[index].details.push(enter)
  }
  else{
    myCars[index].details.splice(pos, 1);
  }
  this.setState({myCars: myCars})
}

  filterEduById(id, index) {
    var myPaths = this.state.myEdus
    if(myPaths.length>index){
    var result = myPaths[index].details.find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterCarById(id, index) {
    var myPaths = this.state.myCars
    if(myPaths.length>index){
    var result = myPaths[index].details.find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterNextEduById(id) {
    var myPaths = this.state.groupedEducation
    for(var iter=0; iter<myPaths.length; iter++)
    {
      var result = myPaths[iter].find(groupObj => {
        return groupObj.id === id;
      })
      if(result!=undefined)
      {
        if(this.props.allSelected || result.currentUser)
        {
          return true;
        }
      }
    }
    return false;
  }
  filterNextCarById(id) {
    var myPaths = this.state.groupedCareer
    for(var iter=0; iter<myPaths.length; iter++)
    {
        var result = myPaths[iter].find(groupObj => {
          return groupObj.id === id;
        })
        if(result!=undefined)
        {
          if(this.props.allSelected || result.currentUser)
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
      <Row className="center">
        <Col>
      {this.props.showPlanUpdater && (<Button className="button" onClick={this.handleUpdate}>Update Path Planner</Button>)}
        </Col>
        <Col>
        <h4>Select to add to planner</h4>
        </Col>
      </Row>
        <Row>
          <Col>
            <FilterCourse qualification={this.state.qualification} nothingSelected={"All"} onChange={this.onChangeQualificationFilter}/>
          </Col>
          <Col>
            <FilterCareer industry={this.state.industry} nothingSelected={"All"} onChange={this.onChangeIndustryFilter}/>
          </Col>
      </Row>
      <Row>
        <Col>
        <table>
            <tbody>
      <tr>
          {this.state.groupedEducation && this.state.groupedEducation.map((n,index) => (
          <td key={index}>  
            {n && n.sort(this.sortByQualification).map((o,i) => (
              (this.props.allSelected || this.currentUserMatch(o)) && (
            <div key={i} className="map mapNavy">
              {this.props.showPlanUpdater && (<input className="checkbox" label="include planner" type="checkbox" name={index} value={o.id} checked={this.filterEduById(o.id, index)} onChange={this.onChangeEducationCheckBox}/>)}
              <EduBox box={o} />
              {o.nextItem && o.nextItem.map((nextIt,j)=> (
              <div key={j}>
              {(this.filterNextEduById(nextIt.id) || this.filterNextCarById(nextIt.id)) && <Xarrow color={colourArray[Math.floor(Math.random() * colourArray.length)]} className="arrow" start={o.id} end={nextIt.id} />}
              </div>
              ))}
            </div>
            )))}
          </td>
          ))}
          </tr>
            </tbody>
            </table>
          </Col>
          <Col>
          <table>
            <tbody>
      <tr>
          {this.state.groupedCareer && this.state.groupedCareer.map((n,index) => (
          <td key={index}>  
            {n && n.sort(this.sortByIndustry).map((o,i) => (
              (this.props.allSelected || this.currentUserMatch(o)) && (
            <div key={i} className="map mapNavy">
              {this.props.showPlanUpdater && (<input label="include planner" type="checkbox" name={index} value={o.id} checked={this.filterCarById(o.id, index)} onChange={this.onChangeCareerCheckBox}/>)}
              <CarBox box={o}/>
              {o.nextItem && o.nextItem.map((nextIt,j)=> (
              <div key={j}>
              {this.filterNextCarById(nextIt.id) && <Xarrow color={colourArray[Math.floor(Math.random() * colourArray.length)]} start={o.id} end={nextIt.id} />}
              </div>
              ))}
            </div>
            )))}
          </td>
          ))}
          </tr>
            </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
}