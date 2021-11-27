import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab} from "../services/firebase";
import {EduBox, CarBox} from './Box';

export default class Planner extends Component {
constructor(props) {
  super(props);
  this.state = {
    user: auth().currentUser,
    myEdus: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
    myCars: [{details:[]}, {details:[]}, {details:[]}, {details:[]}],
  }
}
  componentDidMount() {
    datab.collection('pathPlans').where('user','==', this.state.user.uid).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var myPaths = doc.data()
        this.setState({myEdus: myPaths.eduList})
        this.setState({myCars: myPaths.carList})
      })
    });
    this.handleUpdatePaths=this.handleUpdatePaths.bind(this)
    this.onChangeEducationInputBox=this.onChangeEducationInputBox.bind(this)
    this.onChangeCareerInputBox=this.onChangeCareerInputBox.bind(this)
  }
  handleUpdatePaths(event){
    console.log("Adding notes click")
    console.log(this.state.myCars)
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
  onChangeEducationInputBox(event){
    var myPaths=this.state.myEdus;
    var id=event.target.id
    var split=id.split("_")
    var i= split[0]
    var j = split[1]
    myPaths[i].details[j].notes=event.target.value
    this.setState({myEdus: myPaths})  
  }
  onChangeCareerInputBox(event){
    var myPaths=this.state.myCars;
    var id=event.target.id
    var split=id.split("_")
    var i= split[0]
    var j = split[1]
    myPaths[i].details[j].notes=event.target.value
    console.log(myPaths)
    this.setState({myCars: myPaths})  
  }
  filterEduById(id, index) {
    var myPaths = this.state.myEdus
    if(myPaths.length-1>index){
    var result = myPaths[index+1].details.find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }
  filterCarById(id, index) {
    var myPaths = this.state.myCars
    if(myPaths.length-1>index){
    var result = myPaths[index+1].details.find(groupObj => {
        return groupObj.id === id;
    })
    }
    return result!=undefined
  }

  render() {
  return (
    <div>
      <button onChange={this.handleUpdatePaths}>Update Paths</button>
      <table>
        <tr>
          <td>
          {this.state.myEdus && this.state.myEdus.map((n,index) => (
          <td key={index}>  
            {n.details && n.details.map((o,i) => (
            <div key={i} className="map">
              <tr>
              <EduBox box={o}/>
              <input type="text" value={o.notes} id={index+"_"+i} onChange={this.onChangeEducationInputBox}/>
              {o.nextEducation && o.nextEducation.map((nextEd,j)=> (
              <div key={j}>
              {this.filterEduById(nextEd.id, index) && 
              <Xarrow start={o.id} end={nextEd.id}/>
              }
              </div>
              ))}
              </tr>
            </div>
            ))}
          </td>
          ))}
          </td>
          <td>
          {this.state.myCars && this.state.myCars.map((n,index) => (
          <td key={index}>  
            {n.details && n.details.map((o,i) => (
            <div key={i} className="map">
              <tr>
              <CarBox box={o}/>
              <input type="text" value={o.notes} id={index+"_"+i} onChange={this.onChangeCareerInputBox}/>
              {o.nextEducation && o.nextEducation.map((nextEd,j)=> (
              <div key={j}>
              {this.filterCarById(nextEd.id, index) && 
              <Xarrow start={o.id} end={nextEd.id}/>
              }
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