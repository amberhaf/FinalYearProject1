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
      list: []
    };
    this.handleAddEducation = this.handleAddEducation.bind(this);   
    this.handleRemove = this.handleRemove.bind(this);  
    this.handleAddCareer = this.handleAddCareer.bind(this);    
    this.handleUpload = this.handleUpload.bind(this);
    this.onChangeInstituteName = this.onChangeInstituteName.bind(this);
    this.onChangeQualification = this.onChangeQualification.bind(this);
    this.onChangeCourseTitle = this.onChangeCourseTitle.bind(this);
    this.onChangeCompanyName = this.onChangeCompanyName.bind(this);
    this.onChangeIndustry = this.onChangeIndustry.bind(this);
    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
    this.onChangelength = this.onChangelength.bind(this);
  }
  handleAddEducation(e) {
    e.preventDefault();
    if(this.state.list.length<8)
    {
      var obj = {education: true, instituteName: "", qualification:"", courseTitle:"", length:0};
      this.setState({ list: this.state.list.concat(obj)});
    }
  }
  handleAddCareer(e) {
    e.preventDefault();
    if(this.state.list.length<8)
    {
    var obj = {education: false, companyName: "", industry:"", jobTitle:"", length:0};
    this.setState({ list: this.state.list.concat(obj)});
    }
  }
  handleRemove(e) {
    e.preventDefault();
    var list=this.state.list
    if(list.length>0){
      list.pop();
      this.setState({ list: list});
    }
  }
  handleUpload(e) {
    console.log("validation called")
    var list =  []
    for (var i = 0; i < this.state.list.length; i++){
      if(this.state.list[i].education === true && !(this.state.list[i].instituteName === "" || this.state.list[i].qualification === ""  || this.state.list[i].courseTitle === ""))
      {
        list.push(this.state.list[i])
      }
      else if(this.state.list[i].education === false && ! (this.state.list[i].companyName === "" || this.state.list[i].industry === ""  || this.state.list[i].jobTitle === ""))
      {
        list.push(this.state.list[i])
      }
    }
    if(list.length>0){
      datab.collection("pathIntertwined").add({
        user: this.state.user.uid,
        list: list
      });
      this.setState({list: []});
      this.setState({error: null });
      window.alert("Successfully uploaded paths");
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
    var l=this.state.list;
    l[event.target.name].instituteName=event.target.value;
    this.setState({list: l})
  }

  onChangeQualification(event) {
    var l=this.state.list;
    l[event.target.name].qualification=event.target.value;
    this.setState({eduList: l})
  }

  onChangeCourseTitle(event) {
    var l=this.state.list;
    l[event.target.name].courseTitle=event.target.value;
    this.setState({list: l})
  }
  onChangelength(event) {
    var l=this.state.list;
    l[event.target.name].length=event.target.value;
    this.setState({list: l})
  }

  onChangeCompanyName(event) {
    var l=this.state.list;
    l[event.target.name].companyName=event.target.value;
    this.setState({list: l})
  }

  onChangeIndustry(event) {
    var l=this.state.list;
    l[event.target.name].industry=event.target.value;
    this.setState({llist: l})
  }

  onChangeJobTitle(value, name) {
    var l=this.state.list;
    l[name].jobTitle=value;
    this.setState({list: l})
  }
  onChangelength(event) {
    let { value} = event.target;
    var l=this.state.list;
    l[event.target.name].length=value;
    this.setState({list: l})
  }

  render() {
    return (
    <div className="center section">
      <h4>Fill out as accurately as you can from earliest to latest</h4>
      <h6>Only input items that you feel were essential to your career</h6>
      <Container>
      <Row>
      <Col>
      {this.state.list.map((n,index) => (
        <div key={index}>
        {(n.education===true &&(
      <div className="Education">
        <h4>Education</h4>
      <form>
        <Institution name={index} institution={n.instituteName} nothingSelected={"None"} onChange = {this.onChangeInstituteName}/>
        <FilterCourse name={index} qualification={n.qualification} nothingSelected={"None"} onChange = {this.onChangeQualification}/>
        <span>Course Name:</span>
        <Form.Control placeholder="None" className="form-control"  type="text" name={index} value={n.courseTitle}
        onChange = {this.onChangeCourseTitle}/>
          <span>Number of Years:</span>
          <Form.Control type="number" min="0" max="99" name={index} value={n.length}
          onChange = {this.onChangelength}/>
      </form>
      </div>          
      ))}
      {(n.education===false &&(
      <div className="Career">
        <h4>Career</h4>
        <form>
          <span>Company Name:</span>
          <Form.Control placeholder="None" className="form-control" type="text" name={index} value={n.companyName}
          onChange = {this.onChangeCompanyName}/>
          <FilterCareer name={index} industry={n.industry} nothingSelected={"None"} onChange={this.onChangeIndustry}/>
          <JobTitle name={index} jobTitle={n.jobTitle} nothingSelected={"None"} onChange={this.onChangeJobTitle}/>
          <span>Number of Years:</span>
          <Form.Control className="form-control" type="number" min="0" max="99" name={index} value={n.length}
          onChange = {this.onChangelength}/>
        </form>
      </div>          
      ))}
      </div>))}
      <form>
        <Button className="button margin10" onClick={this.handleAddEducation}>Add new Education</Button>
        <Button className="button margin10" onClick={this.handleAddCareer}>Add new Career</Button>
        </form>
      <form>
        <Button className="button margin10" onClick={this.handleRemove}>Remove last</Button>
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