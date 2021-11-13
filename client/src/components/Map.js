import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab} from "../services/firebase";
import JobSearch from './JobSearch';

const EduBox = (props) => {
  return (
    <div id={props.box.id} className="boxStyle edu">
      <ul>
        <li><b>Company Name:</b></li>
        <li>{props.box.companyName}</li>
        <li><b>Qualification:</b></li>
        <li>{props.box.qualification}</li>
        <li><b>Course Title:</b></li>
        <li>{props.box.courseTitle}</li>
      </ul>
    </div>
  );
};
const CarBox = (props) => {
    return (
      <div id={props.box.id} className="boxStyle car">
        <ul>
          <li><b>Institute Name:</b></li>
          <li>{props.box.instituteName}</li>
          <li><b>Industry:</b></li>
          <li>{props.box.industry}</li>
          <li><b>Job Title:</b></li>
          <li>{props.box.jobTitle}</li>
          <JobSearch search={props.box.jobTitle} />
        </ul>
      </div>
    );
  };
export default class Map extends Component {
constructor(props) {
  super(props);
  this.state = {
    user: auth().currentUser,
    posts: [""],
    industryName: "all",
    qualification: "all",
    pos: 0,
    groupedPost: [],
    groupedCareer: []
  }
}
  componentDidMount() {
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
          if(p[i].eduList.length>h)
          {
            var obj= p[i].eduList[h];
            var result = gp[h].find(groupObj => {
              return groupObj.instituteName === obj.instituteName && groupObj.qualification === obj.qualification && groupObj.courseTitle === obj.courseTitle;
            })
            if(result==undefined){
              var nextEdu=[]
              if(p[i].eduList.length>h+1){
                var nex=p[i].eduList[h+1]
                nextEdu.push({id: nex.instituteName+"_"+nex.qualification+"_"+nex.courseTitle})
              }
              else if(p[i].carList.length>0){
                var nex=p[i].carList[0]
                nextEdu.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
              }
              var insert = {id: obj.instituteName+"_"+obj.qualification+"_"+obj.courseTitle, instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, nextEducation: nextEdu};
              gp[h] = gp[h].concat(insert)
            }
            else{
              var index = gp[h].indexOf(result)
              var nextEd=result.nextEducation
              if(p[i].eduList.length>h+1){
                var nex=p[i].eduList[h+1]
                nextEd.push({id: nex.instituteName+"_"+nex.qualification+"_"+nex.courseTitle})
              }
              else if(p[i].carList.length>0){
                var nex=p[i].carList[0]
                nextEd.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
              }
              gp[h][index].nextEducation=nextEd
            }
          }
        }
      }
      //
      var gc = this.state.groupedCareer
      for (var h=0; h<4; h++){
        gc.push([])
        for (var i=0; i<p.length; i++){
          if(p[i].carList.length>h)
          {
            var obj= p[i].carList[h];
            var result = gc[h].find(groupObj => {
              return groupObj.companyName === obj.companyName && groupObj.industry === obj.industry && groupObj.jobTitle === obj.jobTitle;
            })
            if(result==undefined){
              var nextEdu=[]
              if(p[i].carList.length>h+1){
                var nex=p[i].carList[h+1]
                nextEd.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
              }
              var insert = {id: obj.companyName+"_"+obj.industry+"_"+obj.jobTitle, companyName: obj.companyName, industry: obj.industry, jobTitle: obj.jobTitle, nextEducation: nextEdu};
              gc[h] = gc[h].concat(insert)
            }
            else{
              var index = gc[h].indexOf(result)
              var nextEd=result.nextEducation
              if(p[i].carList.length>h+1){
                var nex=p[i].carList[h+1]
                nextEd.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
              }
              gc[h][index].nextEducation=nextEd
            }
          }
        }
      }
      this.setState({ groupedCareer: gc});
      console.log(this.state.groupedCareer[0][1])
    })
  }
  render() {
  return (
    <div>
      <table>
        <tr>
            <td>
        {this.state.groupedPost && this.state.groupedPost.map((n,index) => (
         <td key={index}>  
          {n && n.map((o,i) => (
          <div key={i} className="map">
              <tr>
            <EduBox box={o} />
            {o.nextEducation && o.nextEducation.map((nextEd,j)=> (
            <div key={j}>
            <Xarrow start={o.id} end={nextEd.id} />
            </div>
            ))}
            </tr>
          </div>
          ))}
         </td>
        ))}
        </td>
        <td>
        {this.state.groupedCareer && this.state.groupedCareer.map((n,index) => (
         <td key={index}>  
          {n && n.map((o,i) => (
          <div key={i} className="map">
              <tr>
            <CarBox box={o} />
            {o.nextEducation && o.nextEducation.map((nextEd,j)=> (
            <div key={j}>
            <Xarrow start={o.id} end={nextEd.id} />
            </div>
            ))}
            </tr>
          </div>
          ))}
         </td>
        ))}
        </td>
        </tr>
      </table>
    </div>
  );
}
}