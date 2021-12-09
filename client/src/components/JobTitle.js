import React, { Component } from "react";


class JobTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            results: [],
            mapRes: [],
            hide: "",
            wordToComplete: "", 
            search: props.search,
        };
        this.getJob = this.getJob.bind(this);
        this.onChangeAutoComplete = this.onChangeAutoComplete.bind(this);
        this.selectItem = this.selectItem.bind(this);
    }
    onChangeAutoComplete(event) {
        this.setState({wordToComplete: event.target.value})
        if(this.state.wordToComplete.length>3)
        {
            var res = this.state.results.filter(this.filterByWord(this.state.wordToComplete));
            this.setState({mapRes: res})
        }
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
    selectItem(event){
        this.setState({wordToComplete: event.target.value})
        // var myDropDown=document.getElementById("jobTitle");
        // myDropDown.size = 0;
    }

    render() {
        return (
            <div>
               <label>Job Title</label>
               <input value={this.state.wordToComplete} onChange={this.onChangeAutoComplete} />
                <select id ="jobTitle" name={this.props.name} autoFocus={true} value={this.state.wordToComplete} onChange={this.selectItem}>{
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