import React, { Component } from "react";


class JobTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            results: [],
            mapRes: [],
            wordToComplete: "", 
            search: props.search,
        };
        this.getJob = this.getJob.bind(this);
        this.onChangeAutoComplete = this.onChangeAutoComplete.bind(this);
        this.onChangeDropDown = this.onChangeDropDown.bind(this);
    }
    onChangeAutoComplete(event) {
        this.setState({wordToComplete: event.target.value})
        if(this.state.wordToComplete.length>3)
        {
            var res = this.state.results.filter(this.filterByWord(this.state.wordToComplete));
            this.setState({mapRes: res})
        }
      }
      onChangeDropDown(event) {
        this.setState({wordToComplete: event.target.value})
        // if(this.state.wordToComplete.length>3)
        // {
        //     var res = this.state.results.filter(this.filterByWord(this.state.wordToComplete));
        //     this.setState({mapRes: res})
        // }
      }
    filterByWord(fYear) {
        return function (stockObj) {
           var temp = stockObj.includes(fYear);
           return temp;
        };
      }
    componentDidMount() {
        this.getJob();
    }
    getJob() {
        var _this = this;
        fetch('https://raw.githubusercontent.com/jneidel/job-titles/master/job-titles.json')
        .then(response => response.json())
        .then(data => _this.setState({results: data["job-titles"]}))
        .catch(() => console.log("Error"));
    }

    render() {
        return (
            <div>
               <label>Job Title</label>
               <input value={this.state.wordToComplete} onChange={this.onChangeAutoComplete}/>
                <select id ="jobTitle" name={this.props.name} onChange={this.onChangeDropDown}>{
                 this.state.mapRes && this.state.mapRes.map((name, index) => {
                     return <option key={index} value={name}>{name}</option>
                 })
              }
              </select>
            </div>
        )
    }
}
export default JobTitle;