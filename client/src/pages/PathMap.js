import React from "react";
import Map from "../components/Map";
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import {datab, auth} from "../services/firebase";

class PathMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      groupedEducation: [],
      groupedCareer: []
    };
  }
  componentDidMount() {
    datab.collection('path').get().then(querySnapshot => {
      let allPosts = [];
      querySnapshot.forEach(doc => {
        allPosts.push(doc.data())
        })
        this.setState({posts: allPosts})
      }).then(() => {
      var p = this.state.posts
      var gp = this.state.groupedEducation
      for (var h=0; h<4; h++){
        gp.push([])
        for (var i=0; i<p.length; i++){
          if(p[i].eduList.length>h)
          {
            var obj= p[i].eduList[h];
            var result = gp[h].find(groupObj => {
              return groupObj.instituteName === obj.instituteName && groupObj.qualification === obj.qualification && groupObj.courseTitle.toLowerCase() === obj.courseTitle.toLowerCase();
            })
            if(result==undefined){
              var nextIt=[]
              if(p[i].eduList.length>h+1){
                var nex=p[i].eduList[h+1]
                nextIt.push({id: nex.instituteName+"_"+nex.qualification+"_"+nex.courseTitle})
              }
              else if(p[i].carList.length>0){
                var nex=p[i].carList[0]
                nextIt.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
              }
              var insert = {id: obj.instituteName+"_"+obj.qualification+"_"+obj.courseTitle, instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, courseLength: obj.courseLength, nextItem: nextIt, numOfEntries: 1, notes: "", cost:0, website:""};
              gp[h] = gp[h].concat(insert)
            }
            else{
              var index = gp[h].indexOf(result)
              var nextIt=result.nextItem
              if(p[i].eduList.length>h+1){
                var nex=p[i].eduList[h+1]
                nextIt.push({id: nex.instituteName+"_"+nex.qualification+"_"+nex.courseTitle})
              }
              else if(p[i].carList.length>0){
                var nex=p[i].carList[0]
                nextIt.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
              }
              gp[h][index].nextItem=nextIt
              gp[h][index].courseLength= gp[h][index].courseLength+parseInt(obj.courseLength)
              gp[h][index].numOfEntries=gp[h][index].numOfEntries+1
            }
          }
        }
      }
      //
      this.setState({ groupedEducation: gp});
      var gc = this.state.groupedCareer
      for (var h=0; h<4; h++){
        gc.push([])
        for (var i=0; i<p.length; i++){
          if(p[i].carList.length>h)
          {
            var obj= p[i].carList[h];
            var result = gc[h].find(groupObj => {
              return groupObj.companyName.toLowerCase() === obj.companyName.toLowerCase() && groupObj.industry === obj.industry && groupObj.jobTitle === obj.jobTitle;
            })
            if(result==undefined){
              var nextIt=[]
              if(p[i].carList.length>h+1){
                var nex=p[i].carList[h+1]
                nextIt.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
              }
              var insert = {id: obj.companyName+"_"+obj.industry+"_"+obj.jobTitle, companyName: obj.companyName, industry: obj.industry, jobTitle: obj.jobTitle, jobLength: obj.jobLength, numOfEntries: 1, nextItem: nextIt, notes: "", earnings:0, website:""};
              gc[h] = gc[h].concat(insert)
            }
            else{
              var index = gc[h].indexOf(result)
              var nextIt=result.nextItem
              if(p[i].carList.length>h+1){
                var nex=p[i].carList[h+1]
                nextIt.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
              }
              gc[h][index].nextItem=nextIt
              gc[h][index].jobLength= gc[h][index].jobLength+parseInt(obj.jobLength)
              gc[h][index].numOfEntries=gc[h][index].numOfEntries+1
            }
          }
        }
      }
      this.setState({ groupedCareer: gc});
      console.log("mapped education: ")
      for(var i=0; i<gp.length; i++)
      {
        console.log("mapped education: " + gp[i][0])
      }
      for(var i=0; i<gc.length; i++)
      {
        console.log("mapped career: "+gc[i][0])
      }
    });
    if (this.state.user) {
    datab.collection('pathPlans').where('user','==', this.state.user.uid).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({myEdus: doc.data().eduList})
        this.setState({myCars: doc.data().carList})
      })
    });
  }
  }

  render() {
    return (
      <div>
        <Header/>
        <Welcome/>
        <Map groupedEducation={this.state.groupedEducation} groupedCareer={this.state.groupedCareer}/>
      </div>
    );
  }
}
export default PathMap;