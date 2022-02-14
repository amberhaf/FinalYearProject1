import axios from 'axios';
import Map from "../components/Map";
import React, { Component } from 'react';
import Header from "../components/Header";
import { datab, auth} from "../services/firebase"; 
import {Form, Button, Container, Row, Col} from 'react-bootstrap'

function compareTitles(cname1, cname2) {
  //Convert to lowercase
  cname1 = cname1.toLowerCase();
  cname2 = cname2.toLowerCase();
  //perform stop word removal
  var stopwords = ["&", "&&","and", "a", "an", "with", "through", "the", "of", "in", "from", "major", "majoring", "minor", "minoring", "single", "double", "course", "degree"];
  var res1 = []
  var words = cname1.split(' ')
  for (var i = 0; i < words.length; i++) {
    //remove punctuation
    var word_clean = words[i].split(/[^\w\s]|_/g).join("")
    if (!stopwords.includes(word_clean) && word_clean !== "") {
      res1.push(word_clean);
    }
  }
  var res2 = []
  words = cname2.split(' ')
  for (var i = 0; i < words.length; i++) {
    //remove punctuation
    var word_clean = words[i].split(/[^\w\s]|_/g).join("")
    if (!stopwords.includes(word_clean) && word_clean !== "") {
      res2.push(word_clean);
    }
  }
  if (res1.sort().join(',') === res2.sort().join(',')) {
    return true;
  }
  else return false;
};


class BulkPath extends Component {
    constructor(props) {
        super(props);
        this.state = {
          user: auth().currentUser,
          uploadedPosts: [],
          groupedEducation: [],
          groupedCareer: []
        }
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload(e) {
      //todo add validation here
      for (var i = 0; i < this.state.uploadedPosts.length; i++){
        if(true){
          datab.collection("path").add({
            user: this.state.user.uid,
            eduList: this.state.uploadedPosts[i].eduList,
            carList: this.state.uploadedPosts[i].carList,
          });
          window.alert("Successfully uploaded paths");
          this.setState({groupedEducation: []})
          this.setState({groupedCareer: []})
        }
      }
    }

    onFileChange = event => {
        console.log(event.target.files)
        this.setState({ selectedFile: event.target.files[0] });
    };
    onFileUpload = () => {
      var storedIds=[]
      if(this.state.user)
      {
        var uid = this.state.user.uid
      }
      else
      {
        uid = ""
      }
      var _this = this;
        const formData = new FormData();
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        fetch('/server/upload',
            {
              method: "POST",
              body: formData
            }
          ).then(response => response.json())
          .then(function(p){
            //when response returned update playlist prop with data 
            console.log(p);
            _this.setState({uploadedPosts: p})
            var gp = _this.state.groupedEducation
            for (var h = 0; h < 4; h++) {
              gp.push([])
              for (var i = 0; i < p.length; i++) {
                if (p[i].eduList.length > h) {
                  var result;
                  var obj = p[i].eduList[h];
                  for (var iter = 0; iter < gp.length; iter++) {
                    result = gp[iter].find(groupObj => {
                      return groupObj.instituteName === obj.instituteName && groupObj.qualification === obj.qualification && (compareTitles(groupObj.courseTitle, obj.courseTitle));
                    })
                    if (result != undefined) {
                      var index = gp[iter].indexOf(result)
                      var nextIt = result.nextItem
                      if (p[i].eduList.length > h + 1) {
                        var nex = p[i].eduList[h + 1]
                        nextIt.push({ id: nex.instituteName + "_" + nex.qualification + "_" + nex.courseTitle })
                      }
                      else if (p[i].carList.length > 0) {
                        var nex = p[i].carList[0]
                        nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
                      }
                      if(p[i].user === uid || storedIds.includes(gp[iter][index].id))
                      {
                        gp[iter][index].currentUser=true;
                        //add id to the list of acceptable ids
                       storedIds.push(nextIt.id)
                      }
                      gp[iter][index].nextItem = nextIt
                      gp[iter][index].courseLength = (parseInt(gp[iter][index].courseLength) + parseInt(obj.courseLength))
                      gp[iter][index].numOfEntries = gp[iter][index].numOfEntries + 1
                      break;
                    }
                  }
                  if (result === undefined) {
                    var nextIt = []
                    if (p[i].eduList.length > h + 1) {
                      var nex = p[i].eduList[h + 1]
                      nextIt.push({ id: nex.instituteName + "_" + nex.qualification + "_" + nex.courseTitle })
                    }
                    else if (p[i].carList.length > 0) {
                      var nex = p[i].carList[0]
                      nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
                    }
                    //add id to the list of acceptable ids
                    var insert = { id: obj.instituteName + "_" + obj.qualification + "_" + obj.courseTitle, instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, courseLength: obj.courseLength, nextItem: nextIt, numOfEntries: 1, notes: "", cost: 0, website: "" , currentUser: p[i].user === uid};
                    if(p[i].user === uid || storedIds.includes(insert.id))
                    {
                      insert.currentUser=true;
                      //add id to the list of acceptable ids
                     storedIds.push(nextIt.id)
                    }
                    gp[h] = gp[h].concat(insert)
                  }
                }
              }
            }
            //
            _this.setState({ groupedEducation: gp });
            var gc = _this.state.groupedCareer
            for (var h = 0; h < 4; h++) {
              gc.push([])
              for (var i = 0; i < p.length; i++) {
                if (p[i].carList.length > h) {
                  var obj = p[i].carList[h];
                  for (var iter = 0; iter <= h; iter++) {
                    var result = gc[iter].find(groupObj => {
                      return groupObj.industry === obj.industry && groupObj.jobTitle === obj.jobTitle && (compareTitles(groupObj.companyName, obj.companyName));
                    })
                    if (result != undefined) {
                      var index = gc[iter].indexOf(result)
                      var nextIt = result.nextItem
                      if (p[i].carList.length > h + 1) {
                        var nex = p[i].carList[h + 1]
                        nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
                      }
                      if(p[i].user === uid || storedIds.includes(gp[iter][index].id))
                      {
                        gp[iter][index].currentUser=true;
                        //add id to the list of acceptable ids
                       storedIds.push(nextIt.id)
                      }
                      gc[iter][index].nextItem = nextIt
                      gc[iter][index].jobLength = parseInt(gc[iter][index].jobLength) + parseInt(obj.jobLength)
                      gc[iter][index].numOfEntries = gc[iter][index].numOfEntries + 1
                      break;
                    }
                  }
                  if (result == undefined) {
                    var nextIt = []
                    if (p[i].carList.length > h + 1) {
                      var nex = p[i].carList[h + 1]
                      nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
                    }
                    var insert = { id: obj.companyName + "_" + obj.industry + "_" + obj.jobTitle, companyName: obj.companyName, industry: obj.industry, jobTitle: obj.jobTitle, jobLength: obj.jobLength, numOfEntries: 1, nextItem: nextIt, notes: "", earnings: 0, website: "", currentUser: p[i].user === uid};
                    if(p[i].user === uid || storedIds.includes(insert.id))
                    {
                      insert.currentUser=true;
                      //add id to the list of acceptable ids
                     storedIds.push(nextIt.id)
                    }
                    gc[h] = gc[h].concat(insert)
                  }
                }
              }
            }
            _this.setState({ groupedCareer: gc });
            window.alert("Successfully updatedjkd paths");
        })      
        .catch((error) => {
          window.alert("Error occurred"+ error.message );
        });
    };
    fileData = () => {
        if (this.state.selectedFile) {
            console.log(this.state.selectedFile)
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    };

    render() {

        return (
            <div>
              <Header/>
              <div className='center section'>
                <h3>
                    Map json file of education career history
                </h3>
                <div>
                    <input type="file" onChange={this.onFileChange} />
                    <Button className="button" onClick={this.onFileUpload}>
                        Upload!
                    </Button>
                </div>
                {this.state.groupedEducation.length>0 && this.state.groupedCareer.length>0 && (
                <div>
                <Button className="button" onClick={this.handleUpload}>Publish to database</Button>
                <Map allSelected={true} showPlanUpdater={false} groupedEducation={this.state.groupedEducation} groupedCareer={this.state.groupedCareer}/>
                </div>
                )}
                </div>
            </div>
        );
    }
}

export default BulkPath;