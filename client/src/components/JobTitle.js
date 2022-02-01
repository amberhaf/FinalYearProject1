import React, { Component } from "react";
import Select from "react-select";

class JobTitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            results: [],
            mapRes: [],
            wordToComplete: this.props.jobTitle, 
            menuIsOpen: false,
        };
        this.getJob = this.getJob.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
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
    onInputChange = (options) => {
        this.setState({wordToComplete: options.toLowerCase()})
        //this.props.onChange(options, this.props.name);
        if(this.state.wordToComplete && this.state.wordToComplete.length>3)
        {
            var res = this.state.results.filter(this.filterByWord(this.state.wordToComplete));
            this.setState({mapRes: res})
            this.setState({ menuIsOpen: true });
        }           
      };
      handleChange(e){
        this.props.onChange(e.value.toLowerCase(), this.props.name);
        this.setState({ menuIsOpen: false });
      }
      

    render() {
        return (
            <div>
               <label>Job Title</label>
              <Select
                options={this.state.mapRes.map((name) => {
                    return { label: name, value: name}
                })}
                className="select-control"
                onInputChange={this.onInputChange}
                menuIsOpen={this.state.menuIsOpen}
                inputValue={this.state.wordToComplete}
                onChange={this.handleChange}
                name={this.props.name}
                placeholder={<div className="select-placeholder-text">None</div>} 
              />
            </div>
        )
    }
}
export default JobTitle;