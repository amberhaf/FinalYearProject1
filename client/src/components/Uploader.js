import React, { Component } from "react";
import { datab, auth} from "../services/firebase"; 
import {FilterCareer, FilterCourse} from './FilterDropDown';
import Institution from "./Institution";
import {Form, Button, Container, Row, Col} from 'react-bootstrap'
import JobTitle from "./JobTitle";

export default class Uploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      type: "education",
      user: auth().currentUser,
      file: null,
      ready: false,
      error: null,
      eduList: [{instituteName: "", qualification:"", courseTitle:"", courseLength:0}],
      carList: [{companyName: "", industry:"", jobTitle:"", jobLength:0}],
    };
    this.handleAddEducation = this.handleAddEducation.bind(this);   
    this.handleRemoveEducation = this.handleRemoveEducation.bind(this);  
    this.handleAddCareer = this.handleAddCareer.bind(this);    
    this.handleRemoveCareer = this.handleRemoveCareer.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.onChangeInstituteName = this.onChangeInstituteName.bind(this);
    this.onChangeQualification = this.onChangeQualification.bind(this);
    this.onChangeCourseTitle = this.onChangeCourseTitle.bind(this);
    this.onChangeCompanyName = this.onChangeCompanyName.bind(this);
    this.onChangeIndustry = this.onChangeIndustry.bind(this);
    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
    this.onChangeCourseLength = this.onChangeCourseLength.bind(this);
    this.onChangeJobLength = this.onChangeJobLength.bind(this);
  }
  handleAddEducation(e) {
    e.preventDefault();
    if(this.state.eduList.length<4)
    {
      var obj = {instituteName: "", qualification:"", courseTitle:"", courseLength:0};
      this.setState({ eduList: this.state.eduList.concat(obj)});
    }
  }
  handleAddCareer(e) {
    e.preventDefault();
    if(this.state.carList.length<4)
    {
    var obj = {companyName: "", industry:"", jobTitle:"", jobLength:0};
    this.setState({ carList: this.state.carList.concat(obj)});
    }
  }
  handleRemoveEducation(e) {
    e.preventDefault();
    var edu=this.state.eduList
    if(edu.length>1){
      edu.pop();
      this.setState({ eduList: edu});
    }
  }
  handleRemoveCareer(e) {
    e.preventDefault();
    var car=this.state.carList
    if(car.length>1){
      car.pop();
      this.setState({ carList: car});
    }
  }
  handleUpload(e) {
    console.log("validation called")
    var edu =  []
    for (var i = 0; i < this.state.eduList.length; i++){
      if(! (this.state.eduList[i].instituteName === "" || this.state.eduList[i].qualification === ""  || this.state.eduList[i].courseTitle === ""))
      {
        edu.push(this.state.eduList[i])
      }
    }
    var car = []    
    for (var i = 0; i < this.state.carList.length; i++){
      if(! (this.state.carList[i].companyName === "" || this.state.carList[i].industry === ""  || this.state.carList[i].jobTitle === ""))
      {
        car.push(this.state.carList[i])
      }
    }
    if(edu.length>0 || car.length>0){
      datab.collection("path").add({
        user: this.state.user.uid,
        eduList: edu,
        carList: car
      });
      this.setState({eduList: [{instituteName: "", qualification:"", courseTitle:"", courseLength:0}]});
      this.setState({carList: [{companyName: "", industry:"", jobTitle:"", jobLength:0}]});
      this.setState({error: null });
      this.refresh();
    }
    else{
      this.setState({ error: "please complete some history" });
    }
  }

  refresh(){
    setTimeout(() => {
      window.location.reload(false);
    }, 1000);
  }
  
  onChangeInstituteName(event) {
    var l=this.state.eduList;
    l[event.target.name].instituteName=event.target.value;
    this.setState({eduList: l})
  }

  onChangeQualification(event) {
    var l=this.state.eduList;
    l[event.target.name].qualification=event.target.value;
    this.setState({eduList: l})
  }

  onChangeCourseTitle(event) {
    var l=this.state.eduList;
    l[event.target.name].courseTitle=event.target.value;
    this.setState({eduList: l})
  }
  onChangeCourseLength(event) {
    var l=this.state.eduList;
    l[event.target.name].courseLength=event.target.value;
    this.setState({eduList: l})
  }

  onChangeCompanyName(event) {
    var l=this.state.carList;
    l[event.target.name].companyName=event.target.value;
    this.setState({carList: l})
  }

  onChangeIndustry(event) {
    var l=this.state.carList;
    l[event.target.name].industry=event.target.value;
    this.setState({carList: l})
  }

  onChangeJobTitle(value, name) {
    var l=this.state.carList;
    l[name].jobTitle=value;
    this.setState({carList: l})
  }
  onChangeJobLength(event) {
    let { value} = event.target;
    var l=this.state.carList;
    l[event.target.name].jobLength=value;
    this.setState({carList: l})
  }

  render() {
    return (
    <div className="center section">
      <Container>
      <Row>
      <Col>
      <h4>Education</h4>
      {this.state.eduList.map((n,index) => (
      <div className="Education" key={index}>
      <form>
        <Institution name={index} institution={n.instituteName} nothingSelected={"None"} onChange = {this.onChangeInstituteName}/>
        <FilterCourse name={index} qualification={n.qualification} nothingSelected={"None"} onChange = {this.onChangeQualification}/>
        <span>Course Name:</span>
        <Form.Control placeholder="None" className="form-control"  type="text" name={index} value={n.courseTitle}
        onChange = {this.onChangeCourseTitle}/>
          <span>Number of Years:</span>
          <Form.Control type="number" min="0" max="99" name={index} value={n.courseLength}
          onChange = {this.onChangeCourseLength}/>
      </form>
      </div>
      ))}
      <form>
        <Button className="button margin10" onClick={this.handleAddEducation}>Add new Education</Button>
        <Button className="button margin10" onClick={this.handleRemoveEducation}>Remove last Education</Button>
      </form>
      </Col>
      <Col>
      <h4>Career</h4>
      {this.state.carList.map((n,index) => (
      <div className="Career" key={index}>
        <form>
          <span>Company Name:</span>
          <Form.Control placeholder="None" className="form-control" type="text" name={index} value={n.companyName}
          onChange = {this.onChangeCompanyName}/>
          <FilterCareer name={index} industry={n.industry} nothingSelected={"None"} onChange={this.onChangeIndustry}/>
          <JobTitle name={index} jobTitle={n.jobTitle} nothingSelected={"None"} onChange={this.onChangeJobTitle}/>
          <span>Number of Years:</span>
          <Form.Control className="form-control" type="number" min="0" max="99" name={index} value={n.jobLength}
          onChange = {this.onChangeJobLength}/>
        </form>
      </div>
      ))}
      <form>
        <Button className="button margin10" onClick={this.handleAddCareer}>Add new Career</Button>
        <Button className="button margin10" onClick={this.handleRemoveCareer}>Remove last Career</Button>
      </form>
      </Col>
      </Row>
      </Container>
      <Button className="greyButton" onClick= {this.handleUpload}>Upload</Button>
      {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
      </div>
    );
  }
}