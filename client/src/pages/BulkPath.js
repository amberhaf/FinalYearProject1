import axios from 'axios';
import Map from "../components/Map";
import React, { Component } from 'react';
import Header from "../components/Header";
import { storage, datab, auth} from "../services/firebase"; 

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
          console.log("Uploaded Successfully");
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
      var _this = this;
        const formData = new FormData();
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        fetch('/upload',
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
                    var insert = {id: obj.instituteName+"_"+obj.qualification+"_"+obj.courseTitle, instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, courseLength: [obj.courseLength], nextEducation: nextEd, numOfEntries: 1, notes: ""};
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
                    gp[h][index].courseLength.push(obj.courseLength)
                    gp[h][index].numOfEntries=gp[h][index].numOfEntries+1
                  }
                }
              }
              _this.setState({ groupedEducation: gp});
            }
            //
            var gc = _this.state.groupedCareer
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
                    var insert = {id: obj.companyName+"_"+obj.industry+"_"+obj.jobTitle, companyName: obj.companyName, industry: obj.industry, jobTitle: obj.jobTitle, jobLength: [obj.jobLength], numOfEntries: 1, nextEducation: nextEd};
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
                    gc[h][index].jobLength.push(obj.jobLength)
                    gc[h][index].numOfEntries=gc[h][index].numOfEntries+1
                  }
                }
              }
            }            console.log(gc)
            _this.setState({ groupedCareer: gc});
        })
        .catch((error) => {
          console.error('Error:', error);
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
                <h3>
                    Map json file of education career history
                </h3>
                <div>
                    <input type="file" onChange={this.onFileChange} />
                    <button onClick={this.onFileUpload}>
                        Upload!
                    </button>
                </div>
                {this.state.groupedEducation.length>0 && this.state.groupedCareer.length>0 && (
                <div>
                <button onClick={this.handleUpload}>Publish to database</button>
                <Map groupedEducation={this.state.groupedEducation} groupedCareer={this.state.groupedCareer}/>
                </div>
                )}
            </div>
        );
    }
}

export default BulkPath;