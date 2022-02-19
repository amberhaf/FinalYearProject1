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
        //retrieve a list of job titles from online api
        //this will be assigned to auto-complete array
        var _this = this;
        fetch('https://raw.githubusercontent.com/jneidel/job-titles/master/job-titles.json')
            .then(response => response.json())
            .then(data => _this.setState({ results: data["job-titles"] }))
            .catch(() => console.log("Error"));
    }
    onInputChange = (options) => {
        this.setState({ wordToComplete: options.toLowerCase() })
        //if text input is longer than 3 letters return inputs that match
        if (this.state.wordToComplete && this.state.wordToComplete.length > 3) {
            //retrieve items from the autocomplete that contain the 3 letters entered
            var res = this.state.results.filter(this.filterByWord(this.state.wordToComplete));
            this.setState({ mapRes: res })
            //open dropdown to view auto-complete options
            this.setState({ menuIsOpen: true });
        }
    };
    handleChange(e) {
        //if something is selected from auto-complete array close the dropdown
        this.props.onChange(e.value.toLowerCase(), this.props.name);
        this.setState({ menuIsOpen: false });
    }


    render() {
        return (
            <div>
                <label>Job Title</label>
                <Select
                    options={this.state.mapRes.map((name) => {
                        return { label: name, value: name }
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