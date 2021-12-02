import React, { Component } from "react";


class JobSearch extends Component {
    constructor(props) {
    super(props);
    this.state = {
        error: null,
        location:'',
        results: [],
        avg: 0,
        search: props.search,
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
        console.log( results)
        this.setState({results : results})
        var avg = (Math.round(results.reduce(this.getTotalSalary, 0.0)/ this.state.results.length * 2)*0.86);
        this.setState({avg : avg})
      })
      .catch(() => console.log("Error"));
  }

  render(){
    return (
      <div>
        <button onClick={this.calcSalary}> Calculate Salary </button>
        €{this.state.avg}
      </div>
    )
  }
}
export default JobSearch;