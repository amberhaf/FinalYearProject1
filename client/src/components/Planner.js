import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab} from "../services/firebase";
import {FilterCareer, FilterCourse} from './FilterDropDown';
import {EduBox, CarBox} from './Box';
import {Container, Row, Col} from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';

function reducer (previousValue, currentValue) {return parseInt(previousValue) + parseInt(currentValue);}

export default class Planner extends Component {
constructor(props) {
  super(props);
  this.state = {
    user: auth().currentUser,
    myEdus: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    myCars: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    cost: [0,0,0,0],
    costIds: ["","","",""],
    earnings: [],
    yearsWorking: 1,
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
    this.onChangeEducationCost=this.onChangeEducationCost.bind(this)
    this.onChangeYearsWorking=this.onChangeYearsWorking.bind(this)
    this.onChangeCareerCost=this.onChangeCareerCost.bind(this)
    this.sortByIndustry = this.sortByIndustry.bind(this); 
    this.sortByQualification = this.sortByQualification.bind(this);   
    this.addToTotal = this.addToTotal.bind(this);
  }
  addToTotal(event){
    var cost = this.state.cost;
    var costIds = this.state.costIds;
    if(costIds[event.target.id]===event.target.name)
    {
      cost[event.target.id]=0;
      costIds[event.target.id]="";
    }
    else{
      cost[event.target.id]=event.target.value;
      costIds[event.target.id]=event.target.name;
    }
    this.setState({cost: cost});
    this.setState({costIds: costIds});
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
  onChangeCareerCost(event){
    var myPaths=this.state.myCars;
    var id=event.target.id
    var split=id.split("_")
    var i= split[0]
    var j = split[1]
    myPaths[i].details[j].cost=event.target.value
    this.setState({myCars: myPaths})  
  }
  onChangeEducationCost(event){
    var myPaths=this.state.myEdus;
    var id=event.target.id
    var split=id.split("_")
    var i= split[0]
    var j = split[1]
    myPaths[i].details[j].cost=event.target.value
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
  onChangeYearsWorking(e) {
    this.setState({yearsWorking: e.target.value})
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
      <Col>
          <h6>Total Cost</h6>
          <h7>{this.state.cost.reduce(reducer, 0)}</h7>
      </Col>
      <Col>
          <h6>Total Earnings in</h6> <input type="number" min="0" max="99" value={this.state.yearsWorking}
          onChange = {this.onChangeYearsWorking}/> <h6>years working</h6>
      </Col>
      <Col>
          <h6>Time to profit</h6>
      </Col>
      <Col>
          <button onClick={this.handleUpdatePaths}>Update Path Planner</button>
      </Col>
      </Row>
      <Row>
        <Col>
        <table>
          <tbody>
      <tr>
          {this.state.myEdus && this.state.myEdus.map((n,index) => (
            <td key={index}>  
            {n.details && n.details.sort(this.sortByQualification).map((o,i) => (
            <div key={i} className="map">
              <EduBox box={o}/>
              <TextareaAutosize value={o.notes} id={index+"_"+i} size="10" onChange={this.onChangeEducationInputBox}/>
              <label>Cost per year:</label><input id={index+"_"+i} value={o.cost} onChange={this.onChangeEducationCost}/>
              <input label="total price comparison" type="checkbox" name={o.id} value={o.cost*o.courseLength.reduce(reducer, 0)/ parseInt(o.courseLength.length)} id={index} onChange={this.addToTotal} checked={this.state.costIds[index]==o.id}/>
              {o.nextEducation && o.nextEducation.map((nextEd,j)=> (
              <div key={j}>
              {(this.filterNextEduById(nextEd.id, index) || this.filterNextCarById(nextEd.id, -1)) && 
              <Xarrow start={o.id} end={nextEd.id}/>
              }
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
          {this.state.myCars && this.state.myCars.map((n,index) => (
            <td key={index}>  
            {n.details && n.details.sort(this.sortByIndustry).map((o,i) => (
            <div key={i} className="map">
              <CarBox box={o}/>
              <TextareaAutosize value={o.notes} id={index+"_"+i} size="10" onChange={this.onChangeCareerInputBox}/>
              <label>Salary:</label><input id={index+"_"+i} value={o.cost} onChange={this.onChangeEducationCost}/>
              {o.nextEducation && o.nextEducation.map((nextEd,j)=> (
              <div key={j}>
              {this.filterNextCarById(nextEd.id, index) && 
              <Xarrow start={o.id} end={nextEd.id}/>
              }
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