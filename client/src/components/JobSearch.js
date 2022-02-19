import React, { Component } from "react";
import { Form, Button } from 'react-bootstrap'

class JobSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      location: '',
      results: [],
      avg: 0,
      search: this.props.search,
      earnings: this.props.earnings,
    };
    this.calcSalary = this.calcSalary.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getTotalSalary(tot, obj) {
    //add the min and max salary returned in result
    return tot + obj.salary_min + obj.salary_max;
  }

  calcSalary() {
    //calculate the average salary of all matching results returned from adzunna api 
    //no results for ireland so I approximate using the uk's
    var url = { search: this.state.search, location: this.state.location, country: 'gb' };
    fetch('/server/getSalary/', {
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
        this.setState({ results: results })
        //sum everything and divide by twice the length as both min and max are returned
        var avg = (results.reduce(this.getTotalSalary, 0.0)) / (this.state.results.length * 2);
        //round and convert from pounds to euros
        avg = (Math.round(avg * 119)) / 100;
        //this will call the parent on change function for text input even though this is not directly changed itself
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(this.inputElement, avg)
        this.inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      })
      .catch(() => console.log("Error"));
  }

  handleChange(e) {
    this.props.onChange(e)
  }

  render() {
    return (
      <div>
        <Form.Control
          className="form-control plannerNumberInput"
          type="number"
          ref={input => { this.inputElement = input }}
          name={this.props.name}
          value={this.props.earnings}
          onChange={this.handleChange} />
        <Button className="button smallFont" onClick={this.calcSalary}> Estimate Salary </Button>
      </div>
    )
  }
}
export default JobSearch;