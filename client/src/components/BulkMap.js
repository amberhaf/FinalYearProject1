import axios from 'axios';
import { auth } from "../services/firebase";
import React, { Component } from 'react';

class BulkMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
          user: auth().currentUser,
          selectedFile: null,
        }
    }
    onFileChange = event => {
        console.log(event.target.files)
        this.setState({ selectedFile: event.target.files[0] });
    };

    onFileUpload = () => {
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
          .then(function(data){
            //when response returned update playlist prop with data 
            console.log(data);
            this.props.onChange(data)
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
                <h3>
                    Map json file of education career history
                </h3>
                <div>
                    <input type="file" onChange={this.onFileChange} />
                    <button onClick={this.onFileUpload}>
                        Upload!
                    </button>
                </div>
                {this.fileData()}
            </div>
        );
    }
}

export default BulkMap;