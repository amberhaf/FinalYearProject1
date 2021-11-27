import React, { Component } from "react";
import { storage, datab, auth} from "../services/firebase"; 
import FilterCareer from './FilterCareer';
import FilterCourse from './FilterCourse';

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
      eduList: [{instituteName: "", qualification:"", courseTitle:""}],
      carList: [{companyName: "", industry:"", jobTitle:""}],
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
  }
  handleUpload(e) {
    console.log("validation called")
    var errorEdu=false;
    var errorCar=false;
    var edu =this.state.eduList
    for (var i = 0; i < this.state.eduList.length; i++){
      if(edu[i].instituteName === "" || edu[i].qualification === ""  || edu[i].courseTitle === "")
      {
        errorEdu = true;
        break;
      }
    }
    var car =this.state.carList    
    for (var i = 0; i < this.state.carList.length; i++){
      if(car[i].companyName === "" || car[i].industry === ""  || car[i].jobTitle === "")
      {
        errorCar =true;
        break;
      }
    }
    if(this.state.eduList[0]===[{instituteName: "", qualification:"", courseTitle:""}])
    {
      this.state.eduList[0]==[]
    }
    if(this.state.carList[0]===[{companyName: "", industry:"", jobTitle:""}])
    {
      this.state.carList[0]==[]
    }
    if(errorEdu === false || errorCar === false){
      datab.collection("path").add({
        user: this.state.user.uid,
        eduList: this.state.eduList,
        carList: this.state.carList
      });
      this.setState({eduList: [{instituteName: "", qualification:"", courseTitle:""}]});
      this.setState({carList: [{companyName: "", industry:"", jobTitle:""}]});
      this.setState({ error: null });
    }
    else{
      this.setState({ error: "please complete some history" });
    }
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

  onChangeJobTitle(event) {
    var l=this.state.carList;
    l[event.target.name].jobTitle=event.target.value;
    this.setState({carList: l})
  }

  handleAddEducation(e) {
    e.preventDefault();
    var obj = {instituteName: "", qualification:"", courseTitle:""};
    this.setState({ eduList: this.state.eduList.concat(obj)});
  }
  handleAddCareer(e) {
    e.preventDefault();
    var obj = {companyName: "", industry:"", jobTitle:""};
    this.setState({ carList: this.state.carList.concat(obj)});
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

  render() {
    return (
    <div className="center">
      <h4>Education</h4>
      <form>
        <button onClick={this.handleAddEducation}>Add new Education</button>
        <button onClick={this.handleRemoveEducation}>Remove last Education</button>
      </form>
      {this.state.eduList.map((n,index) => (
      <div key={index}>
      <form>
        <span>Institute Name</span>
        <input type="text" name={index} value={n.instituteName}
        onChange = {this.onChangeInstituteName}/>
        <FilterCourse name={index} qualification={n.qualification} nothingSelected={"None"} onChange = {this.onChangeQualification}/>
        <span>Course Name:</span>
        <input type="text" name={index} value={n.courseTitle}
        onChange = {this.onChangeCourseTitle}/>
      </form>
      </div>
      ))}
      <h4>Career</h4>
      <form>
        <button onClick={this.handleAddCareer}>Add new Career</button>
        <button onClick={this.handleRemoveCareer}>Remove last Career</button>
      </form>
      {this.state.carList.map((n,index) => (
      <div key={index}>
        <form onSubmit={this.handleUpload}>
          <span>Company Name</span>
          <input type="text" name={index} value={n.companyName}
          onChange = {this.onChangeCompanyName}/>
          <FilterCareer name={index} industry={n.industry} nothingSelected={"None"} onChange={this.onChangeIndustry}/>
          <span>Job Title:</span>
          <input type="text" name={index} value={n.jobTitle}
          onChange = {this.onChangeJobTitle}/>
        </form>
      </div>
      ))}
      <button onClick= {this.handleUpload}>Upload</button>
      {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
      </div>
    );
  }
}