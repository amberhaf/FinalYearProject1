import React, { Component } from "react";


class Institution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            results: [],
            search: props.search,
        };
        this.getEducation = this.getEducation.bind(this);
    }
    componentDidMount() {
        this.getEducation();
    }

    getEducation() {
        var _this = this;
        fetch('http://universities.hipolabs.com/search?country=Ireland')
        .then(response => response.json())
        .then(data => _this.setState({results: data}))
        .catch(() => console.log("Error"));
    }

    render() {
        return (
            <div>
                <label htmlFor="institution">Institution</label>
                <select id ="institution" name={this.props.name} value={this.props.institution} onChange={this.props.onChange}>
                <option value="">{this.props.nothingSelected}</option>{
                 this.state.results && this.state.results.map((obj) => {
                     return <option value={obj.name}>{obj.name}</option>
                 })
              }<option value="other">Other: Institution</option>
              </select>
            </div>
        )
    }
}
export default Institution;