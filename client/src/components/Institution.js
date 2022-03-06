import React, { Component } from "react";
import { Form, Row, Col } from 'react-bootstrap'

class Institution extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            results: [],
            countries: ["Ireland"],
            country: "ireland",
            search: props.search,
        };
        this.getEducation = this.getEducation.bind(this);
        this.getCountry = this.getCountry.bind(this);
        this.changeCountry = this.changeCountry.bind(this);
    }
    componentDidMount() {
        this.getCountry();
        this.getEducation("ireland");
    }
    changeCountry(e) {
        this.setState({ country: e.target.value })
        this.getEducation(e.target.value);
    }
    getCountry() {
        //retrieve a list of countries which will populate country dropdown from online dataset
        var _this = this;
        fetch('http://universities.hipolabs.com/search?')
            .then(response => response.json())
            .then((data) => {
                var Filtered = _this.state.countries;
                data.reduce((arr, el) => {
                    if (!arr.some(current => current === el.country)) {
                        arr.push(el.country);
                    }
                    return arr;
                }, Filtered);
                _this.setState({ countries: Filtered })
            }).catch(() => console.log("Error"));
    }

    getEducation(country) {
        //narrow down institution dropdown based on the country selected from online dataset
        var _this = this;
        fetch('http://universities.hipolabs.com/search?country=' + country)
            .then(response => response.json())
            .then(data => _this.setState({ results: data }))
            .catch(() => console.log("Error"));
    }

    render() {
        return (
            <div>
                <label htmlFor="institution">Institution:</label>
                <Row>
                    <Col>
                        <Form.Select className="form-control" id="country" value={this.state.country} onChange={this.changeCountry}>
                            {
                                this.state.countries && this.state.countries.map((obj, index) => {
                                    return <option key={index} value={obj}>{obj}</option>
                                })
                            }
                        </Form.Select>
                    </Col>
                    <Col>
                        <Form.Select className="form-control" id="institution" name={this.props.name} value={this.props.institution} onChange={this.props.onChange}>
                            <option value="">{this.props.nothingSelected}</option>{
                                this.state.results && this.state.results.map((obj, index) => {
                                    return <option key={index} value={obj.name}>{obj.name}</option>
                                })
                            }<option value="Other: College of Further Education">Other: College of Further Education</option>
                            <option value="Other: Institution">Other: Institution</option>
                        </Form.Select>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default Institution;