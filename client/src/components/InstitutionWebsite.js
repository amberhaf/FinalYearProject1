import React, { Component } from "react";


class InstitionWebsite extends Component {
    constructor(props) {
    super(props);
    this.state = {
        error: null,
        website: "",
        search: props.search,
    };
    this.getInstitutionWebsite = this.getInstitutionWebsite.bind(this);
  }
  
  getInstitutionWebsite(){
    var _this = this;
    fetch('http://universities.hipolabs.com/search?name='+this.state.search)
    .then(response => response.json())
    .then(data => _this.setState({website: data[0].web_pages[0]}))
      .catch(() => console.log("Error"));
  }

  render(){
    return (
      <div>
        <button onClick={this.getInstitutionWebsite}>Get Website</button>
        <a href={this.state.website}>{this.state.website}</a>
      </div>
    )
  }
}
export default InstitionWebsite;