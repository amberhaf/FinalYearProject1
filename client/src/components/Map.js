import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab} from "../services/firebase";
import {FilterCareer, FilterCourse} from './FilterDropDown';
import {EduBox, CarBox} from './Box';
import {Container, Table, Row, Col} from 'react-bootstrap'

export default class Map extends Component {
constructor(props) {
  super(props);
  this.state = {
    user: auth().currentUser,
    posts: [{eduList:[]}, {carList:[]}],
    industry: "",
    qualification: "",
    pos: 0,
    myEdus: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    myCars: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    groupedEducation: [],
    groupedCareer: []
  }
  this.onChangeIndustryFilter = this.onChangeIndustryFilter.bind(this);  
  this.onChangeQualificationFilter = this.onChangeQualificationFilter.bind(this); 
  this.sortByIndustry = this.sortByIndustry.bind(this); 
  this.sortByQualification = this.sortByQualification.bind(this); 
  this.onChangeEducationCheckBox = this.onChangeEducationCheckBox.bind(this);
  this.onChangeCareerCheckBox = this.onChangeCareerCheckBox.bind(this);
  this.handleUpdate = this.handleUpdate.bind(this);
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
            var insert = {id: obj.instituteName+"_"+obj.qualification+"_"+obj.courseTitle, instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, nextEducation: nextEd, notes: ""};
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
      this.setState({ groupedEducation: gp});
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
            var nextEd=[]
            if(p[i].carList.length>h+1){
              var nex=p[i].carList[h+1]
              nextEd.push({id: nex.companyName+"_"+nex.industry+"_"+nex.jobTitle})
            }
            var insert = {id: obj.companyName+"_"+obj.industry+"_"+obj.jobTitle, companyName: obj.companyName, industry: obj.industry, jobTitle: obj.jobTitle, nextEducation: nextEd};
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

    console.log(gc)
    this.setState({ groupedCareer: gc});
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

handleUpdate(e) {
  console.log(this.state.myEdus)
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
onChangeEducationCheckBox(event){
  var myEdus=this.state.myEdus;
  var id=event.target.value
  var index = event.target.name
  var gp=this.state.groupedEducation
  var enter = gp[index].find(groupObj => {
    return groupObj.id === index;
  })
  var pos=-1
  for(var j=0; j<myEdus[index].details.length; j++ )
  {
    if(id==myEdus[index].details[j].id)
    {
      pos=j
      break
    }
  }
  if (pos==-1) {
    myEdus[index].details.push(enter)
  }
  else{
    myEdus[index].details.splice(pos, 1);
  }
  this.setState({myEdus: myEdus})
}

onChangeCareerCheckBox(event){
  var myCars=this.state.myCars;
  var id=event.target.value
  var index = event.target.name
  var gp=this.state.groupedCareer
  var enter = gp[index].find(groupObj => {
    return groupObj.id === index;
  })
  var pos=-1
  for(var j=0; j<myCars[index].details.length; j++ )
  {
    if(id==myCars[index].details[j].id)
    {
      pos=j
      break
    }
  }
  if (pos==-1) {
    myCars[index].details.push(enter)
  }
  else{
    myCars[index].details.splice(pos, 1);
  }
  this.setState({myCars: myCars})
}

  filterEduById(id, index) {
    var myPaths = this.state.myEdus
    if(myPaths.length-1>index){
    var result = myPaths[index].details.find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterCarById(id, index) {
    var myPaths = this.state.myCars
    if(myPaths.length-1>index){
    var result = myPaths[index].details.find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterNextEduById(id, index) {
    var myPaths = this.state.groupedEducation
    if(myPaths.length-1>index){
    var result = myPaths[index+1].find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterNextCarById(id, index) {
    var myPaths = this.state.groupedCareer
    if(myPaths.length-1>index){
    var result = myPaths[index+1].find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }

  render() {
  return (
    <div>
      <Container>
        <Row>
          <Col>
            <FilterCourse qualification={this.state.qualification} nothingSelected={"All"} onChange={this.onChangeQualificationFilter}/>
          </Col>
          <Col>
            <FilterCareer industry={this.state.industry} nothingSelected={"All"} onChange={this.onChangeIndustryFilter}/>
          </Col>
      </Row>
      <Row>
          {this.state.user && (<button onClick={this.handleUpdate}>Update Path Planner</button>)}
      </Row>
      <Row>
        <Col>
        <Container className="table">
      <Row>
          {this.state.groupedEducation && this.state.groupedEducation.map((n,index) => (
          <Col key={index}>  
            {n && n.sort(this.sortByQualification).map((o,i) => (
            <div key={i} className="map">
              <input label="include planner" type="checkbox" name={index} value={o.id} checked={this.filterEduById(o.id, index)} onChange={this.onChangeEducationCheckBox}/>
              <EduBox box={o} />
              {o.nextEducation && o.nextEducation.map((nextEd,j)=> (
              <div key={j}>
              {this.filterNextEduById(nextEd.id, index) || this.filterNextCarById(nextEd.id, -1) && <Xarrow start={o.id} end={nextEd.id} />}
              </div>
              ))}
            </div>
            ))}
          </Col>
          ))}
          </Row>
          </Container>
          </Col>
          <Col>
          <Container className="table">
      <Row>
          {this.state.groupedCareer && this.state.groupedCareer.map((n,index) => (
          <Col className="col" key={index}>  
            {n && n.sort(this.sortByIndustry).map((o,i) => (
            <div key={i} className="map">
              <input label="include planner" type="checkbox" name={index} value={o.id} checked={this.filterCarById(o.id, index)} onChange={this.onChangeCareerCheckBox}/>
              <CarBox box={o}/>
              {o.nextEducation && o.nextEducation.map((nextEd,j)=> (
              <div key={j}>
              {this.filterNextCarById(nextEd.id, index) && <Xarrow start={o.id} end={nextEd.id} />}
              </div>
              ))}
            </div>
            ))}
          </Col>
          ))}
          </Row>
        </Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
}