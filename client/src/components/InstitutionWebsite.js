import React, { Component } from "react";
import {Button} from 'react-bootstrap'

class InstitionWebsite extends Component {
    constructor(props) {
    super(props);
    this.state = {
        error: null,
        website: "",
        search: this.props.search,
    };
  }
  
  componentDidMount() {
    var _this = this;
    //gives the wrong website just for maynooth
    if(this.state.search==="National University of Ireland, Maynooth")
    {
      _this.setState({website: "https://www.maynoothuniversity.ie/"})
    }
    else{
      fetch('http://universities.hipolabs.com/search?name='+this.state.search)
      .then(response => response.json())
      .then(data => _this.setState({website: data[0].web_pages[0]}))
        .catch(() => console.log("Error"));
    }
  }

  render(){
    return (
      <div>
        <Button className="button smallFont" href={this.state.website} target="_blank">See Website</Button>
        {/* <div><a href={this.state.website}>{this.state.website}</a></div> */}
      </div>
    )
  }
}
export default InstitionWebsite;