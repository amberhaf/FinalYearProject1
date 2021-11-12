import React, { Component } from "react";
import { auth, datab} from "../services/firebase";
import FilterCareer from "./FilterCareer";
import FilterCourse from "./FilterCourse";
import JobSearch from "./JobSearch";
import ReactDOM from 'react-dom';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      posts: [""],
      industryName: "all",
      qualification: "all",
      pos: 0,
      groupedPost: []
    };
    this.onChangeIndustryFilter = this.onChangeIndustryFilter.bind(this);  
    this.onChangeQualificationFilter = this.onChangeQualificationFilter.bind(this); 
  }

  componentDidMount() {
    //   datab.collection('path').where('user','==', this.state.user.uid).get().then(querySnapshot => {
    datab.collection('path').get().then(querySnapshot => {
      let allPosts = [];
      querySnapshot.forEach(doc => {
        allPosts.push(doc.data())
        this.setState({posts: allPosts})
      })
    }).then(() => {
      var p = this.state.posts
      var gp = this.state.groupedPost
      for (var h=0; h<4; h++){
        gp.push([])
        for (var i=0; i<p.length; i++){
          console.log("This ran ",i)
          if(p[i].eduList.length>h)
          {
            var obj= p[i].eduList[h];
            var result;
            var result = gp[h].find(groupObj => {
              return groupObj.instituteName === obj.instituteName;
            })
            if(result==undefined){
              var nextEdu=[]
              if(p[i].eduList.length>h+1){
                nextEdu.push(p[i].eduList[h+1])
              }
              var insert = {instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, nextEducation: nextEdu};
              gp[h] = gp[h].concat(insert)
            }
            else{
              var index = gp[h].indexOf(result)
              var nextEd=result.nextEducation
              if(p[i].eduList.length>h+1){
                nextEd.push(p[i].eduList[h+1])
              }
              gp[h][index].nextEducation=nextEd
            }
          }
        }
      }
      for(const course of gp[0])
      {
        console.log(course)
      }
      this.setState({ groupedPost: gp});
    })
  }
  onChangeIndustryFilter(event) {
    this.setState({industryName: event.target.value})
  }
  onChangeQualificationFilter(event){
    this.setState({qualification: event.target.value})
  }

  render() {
    return (
      <div className="container">
        <table>
        <tr>
        <th>
          <FilterCourse qualification={this.state.qualification} onChange={this.onChangeQualificationFilter}/>
        </th>
        <th>
          <FilterCareer industryName={this.state.industryName} onChange={this.onChangeIndustryFilter}/>
        </th>
        </tr>
        {this.state.groupedPost && this.state.groupedPost.map((n,index) => (
         <tr key={index}>  
          {n && n.map((o,i) => (
          <ul className="edu" key={i}>
            <li><b>Institute Name:</b></li>
            <li>{o.instituteName}</li>
            <li><b>Qualification:</b></li>
            <li>{o.qualification}</li>
            <li><b>Course Title:</b></li>
            <li>{o.courseTitle}</li>
            <li><b>Next Education:</b></li>
            <li>{o.nextEducation[0] && o.nextEducation[0].courseTitle}</li>
            </ul>
          ))}
          </tr>
          ))}
        </table>
      </div>
    );
  }
}