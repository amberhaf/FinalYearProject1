import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab} from "../services/firebase";
import {FilterCareer, FilterCourse} from './FilterDropDown';
import {EduBox, CarBox} from './Box';
import {Container, Table, Row, Col} from 'react-bootstrap'

export default class Map extends Component {
constructor(props) {
  super(props);
  this.state = {
    user: auth().currentUser,
    posts: [{eduList:[]}, {carList:[]}],
    industry: "",
    qualification: "",
    pos: 0,
    myEdus: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    myCars: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    groupedEducation: this.props.groupedEducation,
    groupedCareer: this.props.groupedCareer
  }
  this.onChangeIndustryFilter = this.onChangeIndustryFilter.bind(this);  
  this.onChangeQualificationFilter = this.onChangeQualificationFilter.bind(this); 
  this.sortByIndustry = this.sortByIndustry.bind(this); 
  this.sortByQualification = this.sortByQualification.bind(this); 
  this.onChangeEducationCheckBox = this.onChangeEducationCheckBox.bind(this);
  this.onChangeCareerCheckBox = this.onChangeCareerCheckBox.bind(this);
  this.handleUpdate = this.handleUpdate.bind(this);
}

componentDidMount() {
  if (this.state.user) {
    datab.collection('pathPlans').where('user','==', this.state.user.uid).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({myEdus: doc.data().eduList})
        this.setState({myCars: doc.data().carList})
      })
    });
  }
}

handleUpdate(e) {
  console.log(this.state.myEdus)
  if (this.state.user) {
  var uid = this.state.user.uid
  var myEdus = this.state.myEdus
  var myCars = this.state.myCars
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
}
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
    if(myPaths.length-1>index){
    var result = myPaths[index].details.find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterCarById(id, index) {
    var myPaths = this.state.myCars
    if(myPaths.length-1>index){
    var result = myPaths[index].details.find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterNextEduById(id, index) {
    var myPaths = this.state.groupedEducation
    if(myPaths.length-1>index){
    var result = myPaths[index+1].find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterNextCarById(id, index) {
    var myPaths = this.state.groupedCareer
    if(myPaths.length-1>index){
    var result = myPaths[index+1].find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }

  render() {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <FilterCourse qualification={this.state.qualification} nothingSelected={"All"} onChange={this.onChangeQualificationFilter}/>
          </Col>
          <Col>
            <FilterCareer industry={this.state.industry} nothingSelected={"All"} onChange={this.onChangeIndustryFilter}/>
          </Col>
      </Row>
      <Row>
          {this.state.user && (<button onClick={this.handleUpdate}>Update Path Planner</button>)}
      </Row>
      <Row>
        <Col>
        <table>
            <tbody>
      <tr>
          {this.state.groupedEducation && this.state.groupedEducation.map((n,index) => (
          <td key={index}>  
            {n && n.sort(this.sortByQualification).map((o,i) => (
            <div key={i} className="map">
              <input label="include planner" type="checkbox" name={index} value={o.id} checked={this.filterEduById(o.id, index)} onChange={this.onChangeEducationCheckBox}/>
              <EduBox box={o} />
              {o.nextItem && o.nextItem.map((nextIt,j)=> (
              <div key={j}>
              {(this.filterNextEduById(nextIt.id, index) || this.filterNextCarById(nextIt.id, -1)) && <Xarrow start={o.id} end={nextIt.id} />}
              </div>
              ))}
            </div>
            ))}
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
          <td className="col" key={index}>  
            {n && n.sort(this.sortByIndustry).map((o,i) => (
            <div key={i} className="map">
              <input label="include planner" type="checkbox" name={index} value={o.id} checked={this.filterCarById(o.id, index)} onChange={this.onChangeCareerCheckBox}/>
              <CarBox box={o}/>
              {o.nextItem && o.nextItem.map((nextIt,j)=> (
              <div key={j}>
              {this.filterNextCarById(nextIt.id, index) && <Xarrow start={o.id} end={nextIt.id} />}
              </div>
              ))}
            </div>
            ))}
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