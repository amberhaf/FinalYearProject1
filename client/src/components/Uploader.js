import React, { Component } from "react";
import { storage, datab, auth} from "../services/firebase";   
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
      eduList: [{instituteName: "", qualification:"", courseTitle:"", courseDescription:""}],
      carList: [{companyName: "", industry:"", jobTitle:"", jobDescription:""}],
    };
    this.handleAddEducation = this.handleAddEducation.bind(this);   
    this.handleRemoveEducation = this.handleRemoveEducation.bind(this);  
    this.handleAddCareer = this.handleAddCareer.bind(this);    
    this.handleRemoveCareer = this.handleRemoveCareer.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.onChangeInstituteName = this.onChangeInstituteName.bind(this);
    this.onChangeQualification = this.onChangeQualification.bind(this);
    this.onChangeCourseTitle = this.onChangeCourseTitle.bind(this);
    this.onChangeCourseDescription  = this.onChangeCourseDescription.bind(this)
    this.onChangeCompanyName = this.onChangeCompanyName.bind(this);
    this.onChangeIndustry = this.onChangeIndustry.bind(this);
    this.onChangeJobTitle = this.onChangeJobTitle.bind(this);
    this.onChangeJobDescription  = this.onChangeJobDescription.bind(this);
  }
  handleUpload(e) {
    console.log("validation called")
    var errorEdu=false;
    var errorCar=false;
    var edu =this.state.eduList
    for (var i = 0; i < this.state.eduList.length; i++){
      if(edu[i].instituteName === "" || edu[i].qualification === ""  || edu[i].courseTitle === "" || edu[i].courseDescription === "")
      {
        errorEdu = true;
        break;
      }
    }
    var car =this.state.carList    
    for (var i = 0; i < this.state.carList.length; i++){
      if(car[i].companyName === "" || car[i].industry === ""  || car[i].jobTitle === "" || car[i].jobDescription === "")
      {
        errorCar =true;
        break;
      }
    }
    if(errorEdu === false || errorCar === false){
      datab.collection("path").add({
        user: this.state.user.uid,
        eduList: this.state.eduList,
        carList: this.state.carList
      });
      this.setState({eduList: [{instituteName: "", qualification:"", courseTitle:"", courseDescription:""}]});
      this.setState({carList: [{companyName: "", industry:"", jobTitle:"", jobDescription:""}]});
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

  onChangeCourseDescription(event) {  
    var l=this.state.eduList;
    l[event.target.name].courseDescription=event.target.value;
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

  onChangeJobDescription(event) {
    var l=this.state.carList;
    l[event.target.name].jobDescription=event.target.value;
    this.setState({carList: l})
  }
  handleAddEducation(e) {
    e.preventDefault();
    var obj = {instituteName: "", qualification:"", courseTitle:"", courseDescription:""};
    this.setState({ eduList: this.state.eduList.concat(obj)});
  }
  handleAddCareer(e) {
    e.preventDefault();
    var obj = {companyName: "", industry:"", jobTitle:"", jobDescription:""};
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
        <span>Qualification</span>
        <input type="text" name={index} value={n.qualification}
        onChange = {this.onChangeQualification}/>
        <span>Course Name:</span>
        <input type="text" name={index} value={n.courseTitle}
        onChange = {this.onChangeCourseTitle}/>
        <span>Description:</span>
        <input type="text" name={index} value={n.courseDescription}
        onChange = {this.onChangeCourseDescription}/>
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
          <span>Industry</span>
          <input type="text" name={index} value={n.industry}
          onChange = {this.onChangeIndustry}/>
          <span>Job Title:</span>
          <input type="text" name={index} value={n.jobTitle}
          onChange = {this.onChangeJobTitle}/>
          <span>Description:</span>
          <input type="text" name={index} value={n.jobDescription}
          onChange = {this.onChangeJobDescription}/>
        </form>
      </div>
      ))}
      <button onClick= {this.handleUpload}>Upload</button>
      {this.state.error ? <p className="text-danger">{this.state.error}</p> : null}
      </div>
    );
  }
}