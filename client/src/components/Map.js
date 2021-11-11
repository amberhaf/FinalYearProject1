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
      for (var h=0; h<1; h++){
        for (var i=0; i<p.length; i++){
          console.log("This ran ",i)
          if(p[i].eduList.length>h)
          {
            var obj= p[i].eduList[h];
            var result;
            var result = this.state.groupedPost.find(groupObj => {
              return groupObj.instituteName === obj.instituteName;
            })
            if(result==undefined){
              //console.log("this object has never been seen before")
              var nextEdu=[]
              if(p[i].eduList.length>h+1){
                nextEdu.push(p[i].eduList[h+1])
              }
              var insert = {instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, nextEducation: nextEdu};
              console.log("new object", insert)
              this.setState({ groupedPost: this.state.groupedPost.concat(insert)});
            }
            else{
              //console.log("this object is at: ", result)
              var gp = this.state.groupedPost
              var index = gp.indexOf(result)
              var nextEd=result.nextEducation
              if(p[i].eduList.length>h+1){
                nextEd.push(p[i].eduList[h+1])
              }
              gp[index].nextEducation=nextEd
              this.setState({ groupedPost: gp});
              console.log("found index at ", index, " for item i", i)
              console.log("this object is at: ", result)
              console.log(nextEd)
            }
          }
        }
      }
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
        {this.state.posts && this.state.posts.map((n,index) => (
         <tr key={index}>
          <td>
          {n.eduList && n.eduList.map((o,i) => (
          <span>
          <span>&rarr;</span>
          <ul className="edu" key={i}>
            <li><b>Institute Name:</b></li>
            <li>{o.instituteName}</li>
            <li><b>Qualification:</b></li>
            <li>{o.qualification}</li>
            <li><b>Course Title:</b></li>
            <li>{o.courseTitle}</li>
            <li><b>Course Description:</b></li>
            <li>{o.courseDescription}</li>
            <button>Add to my paths</button>
            </ul>
            </span>
          ))}
          </td>
          <td>
          {n.carList && n.carList.map((o,i) => (
          <span >
          <span>&rarr;</span>
          <ul className="car" key={i}>
            <li><b>Company Name</b></li>
            <li>{o.companyName}</li>
            <li><b>Industry</b></li>
            <li>{o.industry}</li>
            <li><b>Job Title:</b></li>
            <li>{o.jobTitle}</li>
            <li><b>Description:</b></li>
            <li>{o.jobDescription}</li>
            {/* <JobSearch search={o.jobTitle}/> */}
          </ul>
          </span>
          ))}
        </td>
        </tr>
        ))}
        </table>
      </div>
    );
  }
}