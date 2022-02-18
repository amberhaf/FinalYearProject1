import axios from 'axios';
import Map2 from "../components/Map2";
import React, { Component } from 'react';
import Header from "../components/Header";
import { datab, auth} from "../services/firebase"; 
import {Form, Button, Container, Row, Col} from 'react-bootstrap'
import PreRenderMap from "../components/Functions";

class BulkPath extends Component {
    constructor(props) {
        super(props);
        this.state = {
          user: auth().currentUser,
          uploadedPosts: [],
          groupedPosts: [],
        }
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload(e) {
      //todo add validation here
      for (var i = 0; i < this.state.uploadedPosts.length; i++){
        var list =  []
        var uploadedPath=this.state.uploadedPosts[i].list
        for (var j = 0; j < uploadedPath.length; j++){
          if(uploadedPath[j].education === true && !(uploadedPath[j].instituteName === "" || uploadedPath[j].qualification === ""  || uploadedPath[j].courseTitle === ""))
          {
            list.push(uploadedPath[j])
          }
          else if(uploadedPath[j].education === false && ! (uploadedPath[j].companyName === "" || uploadedPath[j].industry === ""  || uploadedPath[j].jobTitle === ""))
          {
            list.push(uploadedPath[j])
          }
        }
        if(list.length>0){
          datab.collection("pathIntertwined").add({
            user: this.state.user.uid,
            list: list
          });
        }
      }
      window.alert("Successfully published paths");
      this.setState({groupedPosts: []})
      this.setState({uploadedPosts: []})
    }

    onFileChange = event => {
        console.log(event.target.files)
        this.setState({ selectedFile: event.target.files[0] });
    };
    onFileUpload = () => {
      var uid = ""
      if(this.state.user)
      {
        var uid = this.state.user.uid
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
            _this.setState({uploadedPosts: p})
            var gp = _this.state.groupedPosts
            PreRenderMap(p, gp, uid);
            _this.setState({ groupedPosts: gp });
            window.alert("Successfully updated paths");
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
                {this.state.groupedPosts.length>0 && (
                <div>
                <Button className="button" onClick={this.handleUpload}>Publish to database</Button>
                <Map2 allSelected={true} showPlanUpdater={false} groupedPosts={this.state.groupedPosts}/>
                </div>
                )}
                </div>
            </div>
        );
    }
}

export default BulkPath;