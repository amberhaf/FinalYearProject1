import React, { Component } from "react";


class JobSearch extends Component {
    constructor(props) {
    super(props);
    this.state = {
        error: null,
        location:'',
        results: [],
        avg: 0,
        search: this.props.search,
        earnings: this.props.earnings,
    };
    this.calcSalary = this.calcSalary.bind(this);
  }
  getTotalSalary(tot, obj) {
    return tot + obj.salary_min + obj.salary_max;
  }
  
  calcSalary() {
    var url = {search: this.state.search, location: this.state.location, country: 'gb'};
    fetch('/server/choosePlaylist/' , {
      method: "POST",
      headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*'
        },
        body: JSON.stringify(url)
    })
    .then(response => response.json())
      .then(({ results }) => {
        //console.log( results)
        for(var i=0; i<results.length; i++)
        {
          console.log(results[i].title)
        }
        this.setState({results : results})
        var avg = Math.round(results.reduce((this.getTotalSalary, 0.0)/ this.state.results.length)*119) / 100;
        this.setState({earnings : avg})
        // document.getElementById("inputSalary").onchange()
      })
      .catch(() => console.log("Error"));
  }

  render(){
    return (
      <div>
        <button onClick={this.calcSalary}> Estimate Salary </button>
        <label>Salary:</label><input id={this.props.id} value={this.state.earnings} onChange={this.props.onChange}/>
      </div>
    )
  }
}
export default JobSearch;