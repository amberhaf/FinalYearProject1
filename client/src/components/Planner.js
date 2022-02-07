import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab} from "../services/firebase";
import {FilterCareer, FilterCourse} from './FilterDropDown';
import {EduBox, CarBox} from './Box';
import {Checkbox, Button, Form, Container, Row, Col} from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import InstitionWebsite from './InstitutionWebsite';
import JobSearch from './JobSearch';

function reducer (previousValue, currentValue) {return parseInt(previousValue) + parseInt(currentValue);}

function removeNull (array) {return array.filter(x => x !== 0 && x !==undefined)};

export default class Planner extends Component {
constructor(props) {
  super(props);
  this.state = {
    user: auth().currentUser,
    myEdus: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    myCars: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    cost: [0,0,0,0],
    costIds: ["","","",""],
    earnings: [0,0,0,0],
    earningsIds: ["", "", "", ""],
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
    this.onChangeCareerEarnings=this.onChangeCareerEarnings.bind(this)
    this.sortByIndustry = this.sortByIndustry.bind(this); 
    this.sortByQualification = this.sortByQualification.bind(this);   
    this.addToTotal = this.addToTotal.bind(this);
    this.addToEarnings = this.addToEarnings.bind(this);
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
  addToEarnings(event){
    var earnings = this.state.earnings;
    var earningsIds = this.state.earningsIds;
    if(earningsIds[event.target.id]===event.target.name)
    {
      earnings[event.target.id]=0;
      earningsIds[event.target.id]="";
    }
    else{
      earnings[event.target.id]=event.target.value;
      earningsIds[event.target.id]=event.target.name;
    }
    console.log(earnings)
    this.setState({earnings: earnings});
    this.setState({earningsIds: earningsIds});
    console.log(removeNull(this.state.earnings).length)
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
    try{
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
    window.alert("Successfully updated paths");
  }
  catch(error)
  {
    window.alert("Error occurred"+ error.message );
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
  onChangeCareerEarnings(event){
    var myPaths=this.state.myCars;
    var name=event.target.name
    var split=name.split("_")
    var i= split[0]
    var j = split[1]
    myPaths[i].details[j].earnings=event.target.value
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
    var totalCost = this.state.cost.reduce(reducer, 0);
    var nonNullEarnings = removeNull(this.state.earnings);
    var averageGrossEarnings = (nonNullEarnings.reduce(reducer, 0)/nonNullEarnings.length);
    var taxCredit = 3400;
    var lowerTaxDeduction = (Math.min(averageGrossEarnings, 36800))*0.2;
    var higherTaxDeduction = (Math.max(0, averageGrossEarnings-36800))*0.4;
    var totalNetEarnings = averageGrossEarnings-(Math.max(0,lowerTaxDeduction+higherTaxDeduction-taxCredit));
    var yearsToPayOff =  (Math.round((totalCost /totalNetEarnings)*100))/100;
    var totalEarnings = (Math.round((totalNetEarnings*this.state.yearsWorking)*100))/100;


  return (
    <div className='section'>
      <Container>
      <Row>
      <Col>
          <label><b>Total Cost: </b></label>
          {totalCost>0 && <Button className="form-control totalButton"> €{totalCost}</Button>}
      </Col>
      <Col>
          <div><label><b>Total Net Earnings: </b></label> {(!(isNaN(yearsToPayOff)) && <Button className="form-control totalButton"> €{totalEarnings}</Button>)}</div>
          {(!(isNaN(yearsToPayOff)) && <div><Form.Control className="form-control totalInput" type="number" min="0" max="99" value={this.state.yearsWorking}
          onChange = {this.onChangeYearsWorking}/> <span>years working</span></div>)}
      </Col>
      <Col>
      <div><label><b>Years to pay off: </b></label>{(!(isNaN(yearsToPayOff)) && <Button className="form-control totalButton">{yearsToPayOff}</Button>)}</div>
      </Col>
      <Col>
          <Button className="button greyButton" onClick={this.handleUpdatePaths}>Update Path Planner</Button>
      </Col>
      </Row>
      <Row>
      <Row>
          <Col>
            <FilterCourse qualification={this.state.qualification} nothingSelected={"All"} onChange={this.onChangeQualificationFilter}/>
          </Col>
          <Col>
            <FilterCareer industry={this.state.industry} nothingSelected={"All"} onChange={this.onChangeIndustryFilter}/>
          </Col>
      </Row>
        <Col>
        <table>
          <tbody>
      <tr className="block">
          {this.state.myEdus && this.state.myEdus.map((n,index) => (
            <td key={index}>  
            {n.details && n.details.sort(this.sortByQualification).map((o,i) => (
            <div key={i} className="map mapPurple center">
              <input type="checkbox" id={index} name={o.id} value={(o.cost*(o.courseLength/(o.numOfEntries||1)))} onChange={this.addToTotal} checked={o.id==this.state.costIds[index]}/>
              <label className="lightFont">Cost per year (€):</label>
              <Form.Control className="form-control plannerNumberInput" id={index+"_"+i} type="number" value={o.cost} onChange={this.onChangeEducationCost}/>
              <InstitionWebsite search={o.instituteName} />
              <EduBox box={o}/>
              <TextareaAutosize className="stickyNote" value={o.notes} id={index+"_"+i} onChange={this.onChangeEducationInputBox} placeholder="Enter notes…"/>
              {o.nextItem && o.nextItem.map((nextIt,j)=> (
              <div key={j}>
              {(this.filterNextEduById(nextIt.id, index) || this.filterNextCarById(nextIt.id, -1)) && 
              <Xarrow color="#8aa14c" start={o.id} end={nextIt.id}/>
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
      <tr className="block">
          {this.state.myCars && this.state.myCars.map((n,index) => (
            <td key={index}>  
            {n.details && n.details.sort(this.sortByIndustry).map((o,i) => (
            <div key={i} className="map mapBlue center">
              <input className="checkbox" type="checkbox" id={index} name={o.id} value={o.earnings} onChange={this.addToEarnings} checked={o.id==this.state.earningsIds[index]}/>
              <label className="lightFont">Annual Salary (€):</label>
              <JobSearch search={o.jobTitle} name={index+"_"+i} earnings={o.earnings} onChange={this.onChangeCareerEarnings}/>
              <CarBox box={o}/>
              <TextareaAutosize className="stickyNote" value={o.notes} id={index+"_"+i} onChange={this.onChangeCareerInputBox} placeholder="Enter notes…"/>     
              {o.nextItem && o.nextItem.map((nextIt,j)=> (
              <div key={j}>
              {this.filterNextCarById(nextIt.id, index) && 
              <Xarrow color="#8aa14c" start={o.id} end={nextIt.id}/>
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