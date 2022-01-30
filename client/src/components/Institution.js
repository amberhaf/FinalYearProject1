import React, { Component } from "react";
import { Form} from 'react-bootstrap'

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
                <label htmlFor="institution">Institution:</label>
                <Form.Select className="form-control" id ="institution" name={this.props.name} value={this.props.institution} onChange={this.props.onChange}>
                <option value="">{this.props.nothingSelected}</option>{
                 this.state.results && this.state.results.map((obj, index) => {
                     return <option key={index} value={obj.name}>{obj.name}</option>
                 })
              }<option value="Other: College of Further Education">Other: College of Further Education</option>
              <option value="Other: Institution">Other: Institution</option>
              </Form.Select>
            </div>
        )
    }
}
export default Institution;