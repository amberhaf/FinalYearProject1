import Map from "../components/Map";
import React, { Component } from 'react';
import Header from "../components/Header";
import { datab, auth } from "../services/firebase";
import { Container, Button } from 'react-bootstrap'
import PreRenderMap from "../components/PreRenderMap";
import { Link } from "react-router-dom";
import DataSet1 from '../dataSet1.txt';

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
    //validate to keep just object where all fields have values
    for (var i = 0; i < this.state.uploadedPosts.length; i++) {
      var list = []
      var uploadedPath = this.state.uploadedPosts[i].list
      for (var j = 0; j < uploadedPath.length; j++) {
        if (uploadedPath[j].education === true && !(uploadedPath[j].instituteName === "" || uploadedPath[j].qualification === "" || uploadedPath[j].courseTitle === "")) {
          list.push(uploadedPath[j])
        }
        else if (uploadedPath[j].education === false && !(uploadedPath[j].companyName === "" || uploadedPath[j].industry === "" || uploadedPath[j].jobTitle === "")) {
          list.push(uploadedPath[j])
        }
      }
      if (list.length > 0) {
        datab.collection("path").add({
          user: this.state.user.uid,
          list: list
        });
      }
    }
    window.alert("Successfully published paths");
    this.setState({ groupedPosts: [] })
    this.setState({ uploadedPosts: [] })
  }

  onFileChange = event => {
    //allow user to add a file from computer
    this.setState({ selectedFile: event.target.files[0] });
  };
  onFileUpload = () => {
    var uid = ""
    if (this.state.user) {
      var uid = this.state.user.uid
    }
    var _this = this;
    const formData = new FormData();
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    //send file to server to be processed
    fetch('/server/upload',
      {
        method: "POST",
        body: formData
      }
    ).then(response => response.json())
      .then(function (p) {
        //store the results you get from server
        _this.setState({ uploadedPosts: p })
        var gp = _this.state.groupedPosts
        //pre-format them so that similar objects are matched together and they can be more easily rendered
        PreRenderMap(p, gp, uid);
        _this.setState({ groupedPosts: gp });
        window.alert("Successfully updated paths");
      })
      .catch((error) => {
        window.alert("Error occurred" + error.message);
      });
  };

  render() {

    return (
      <div>
        <Header />
        <div className='section'>
          <Container className="center">
            <h5>Map multiple peoples career paths at once</h5>
            <p>Upload a json file of education career history in the below format</p>
            <Link to={DataSet1} target="_blank">Example Json</Link>
            <div>
              <input type="file" onChange={this.onFileChange} />
              <Button className="button" onClick={this.onFileUpload}>
                Upload!
              </Button>
            </div>
            {this.state.groupedPosts.length > 0 && (
              <div>
                <Button className="button" onClick={this.handleUpload}>Publish to database</Button>
                <Map allSelected={true} showPlanUpdater={false} groupedPosts={this.state.groupedPosts} qualification="" industry="" />
              </div>
            )}
          </Container>
        </div>
      </div>
    );
  }
}

export default BulkPath;