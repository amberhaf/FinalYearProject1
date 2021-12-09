import React from "react";
import Map from "../components/Map";
import Header from "../components/Header";
import { storage, datab, auth} from "../services/firebase";

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
              return groupObj.instituteName === obj.instituteName && groupObj.qualification === obj.qualification && groupObj.courseTitle === obj.courseTitle;
            })
            if(result==undefined){
              var nextEd=[]
              if(p[i].eduList.length>h+1){
                var nex=p[i].eduList[h+1]
                nextEd.push({id: nex.instituteName+"_"+nex.qualification+"_"+nex.courseTitle})
              }
              else if(p[i].carList.length>0){
                var nex=p[i].carList[0]
                nextEd.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
              }
              var insert = {id: obj.instituteName+"_"+obj.qualification+"_"+obj.courseTitle, instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, courseLength: obj.courseLength, nextEducation: nextEd, numOfEntries: 1, notes: "", cost:0, website:""};
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
              gp[h][index].courseLength.concat(obj.courseLength)
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
              return groupObj.companyName === obj.companyName && groupObj.industry === obj.industry && groupObj.jobTitle === obj.jobTitle;
            })
            if(result==undefined){
              var nextEd=[]
              if(p[i].carList.length>h+1){
                var nex=p[i].carList[h+1]
                nextEd.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
              }
              var insert = {id: obj.companyName+"_"+obj.industry+"_"+obj.jobTitle, companyName: obj.companyName, industry: obj.industry, jobTitle: obj.jobTitle, jobLength: obj.jobLength, numOfEntries: 1, nextEducation: nextEd,  notes: "", cost:0, website:""};
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
              gc[h][index].jobLength.concat(obj.jobLength)
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
        <Map groupedEducation={this.state.groupedEducation} groupedCareer={this.state.groupedCareer}/>
      </div>
    );
  }
}
export default PathMap;