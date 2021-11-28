import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab} from "../services/firebase";
import {FilterCareer, FilterCourse} from './FilterDropDown';
import {EduBox, CarBox} from './Box';
import {Container, Row, Col} from 'react-bootstrap'

export default class Planner extends Component {
constructor(props) {
  super(props);
  this.state = {
    user: auth().currentUser,
    myEdus: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    myCars: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    industry: "",
    qualification: "",
  }
}
  componentDidMount() {
    datab.collection('pathPlans').where('user','==', this.state.user.uid).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var myPaths = doc.data()
        this.setState({myEdus: myPaths.eduList})
        this.setState({myCars: myPaths.carList})
      })
    });
    this.onChangeIndustryFilter = this.onChangeIndustryFilter.bind(this);  
    this.onChangeQualificationFilter = this.onChangeQualificationFilter.bind(this);   
    this.handleUpdatePaths=this.handleUpdatePaths.bind(this)
    this.onChangeEducationInputBox=this.onChangeEducationInputBox.bind(this)
    this.onChangeCareerInputBox=this.onChangeCareerInputBox.bind(this)
    this.sortByIndustry = this.sortByIndustry.bind(this); 
    this.sortByQualification = this.sortByQualification.bind(this);   
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
  handleUpdatePaths(event){
    console.log("Adding notes click")
    console.log(this.state.myCars)
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
  onChangeEducationInputBox(event){
    var myPaths=this.state.myEdus;
    var id=event.target.id
    var split=id.split("_")
    var i= split[0]
    var j = split[1]
    myPaths[i].details[j].notes=event.target.value
    this.setState({myEdus: myPaths})  
  }
  onChangeCareerInputBox(event){
    var myPaths=this.state.myCars;
    var id=event.target.id
    var split=id.split("_")
    var i= split[0]
    var j = split[1]
    myPaths[i].details[j].notes=event.target.value
    console.log(myPaths)
    this.setState({myCars: myPaths})  
  }
  filterNextEduById(id, index) {
    var myPaths = this.state.myEdus
    if(myPaths.length-1>index){
    var result = myPaths[index+1].details.find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterNextCarById(id, index) {
    var myPaths = this.state.myCars
    if(myPaths.length-1>index){
    var result = myPaths[index+1].details.find(groupObj => {
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
          <button onClick={this.handleUpdatePaths}>Update Path Planner</button>
      </Row>
      <Row>
        <Col>
        <Container className="table">
      <Row>
          {this.state.myEdus && this.state.myEdus.map((n,index) => (
            <Col className="col" key={index}>  
            {n.details && n.details.sort(this.sortByQualification).map((o,i) => (
            <div key={i} className="map">
              <EduBox box={o}/>
              <input type="text" value={o.notes} id={index+"_"+i} size="10" onChange={this.onChangeEducationInputBox}/>
              {o.nextEducation && o.nextEducation.map((nextEd,j)=> (
              <div key={j}>
              {this.filterNextEduById(nextEd.id, index) && 
              <Xarrow start={o.id} end={nextEd.id}/>
              }
              </div>
              ))}
            </div>
            ))}
          </Col>
          ))}
          </Row>
        </Container>
          </Col>
          <Col>
          <Container className="table">
      <Row>
          {this.state.myCars && this.state.myCars.map((n,index) => (
            <Col className="col" key={index}>  
            {n.details && n.details.sort(this.sortByIndustry).map((o,i) => (
            <div key={i} className="map">
              <CarBox box={o}/>
              <input type="text" value={o.notes} id={index+"_"+i} size="10" onChange={this.onChangeCareerInputBox}/>
              {o.nextEducation && o.nextEducation.map((nextEd,j)=> (
              <div key={j}>
              {this.filterNextCarById(nextEd.id, index) && 
              <Xarrow start={o.id} end={nextEd.id}/>
              }
              </div>
              ))}
            </div>
            ))}
          </Col>
          ))}
          </Row>
        </Container>
          </Col>
          </Row>
        </Container>
    </div>
  );
}
}