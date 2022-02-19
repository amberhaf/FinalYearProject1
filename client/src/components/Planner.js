import React, { useRef, Component } from 'react';
import Xarrow from 'react-xarrows';
import { auth, datab } from "../services/firebase";
import { FilterCareer, FilterCourse } from './FilterDropDown';
import { EduBox, CarBox } from './Box';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import InstitionWebsite from './InstitutionWebsite';
import JobSearch from './JobSearch';

const colourArray = ['#d4afb9', '#ffd670', '#d1cfe2',
  '#9cadce', '#7ec4cf', '#52b2cf', '#79addc', '#ffc09f',
  '#ffee93', '#adf7b6', '#84dcc6', '#a5ffd6', '#ffa69e',
  '#ff686b', '#f6bc66', '#ff7477', '#e69597', '#ceb5b7',
  '#b5d6d6', '#9cf6f6', '#f6ac69', '#fdffb6', '#ff9770']

function reducer(previousValue, currentValue) { return parseInt(previousValue) + parseInt(currentValue); }

function removeNull(array) { return array.filter(x => x !== 0 && x !== undefined) };

export default class Planner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      //paths user has saved in my planner
      myPaths: [{ details: [] }, { details: [] }, { details: [] }, { details: [] }, { details: [] }, { details: [] }, { details: [] }, { details: [] }],
      cost: [0, 0, 0, 0, 0, 0, 0, 0],
      costIds: ["", "", "", "", "", "", "", ""],
      earnings: [0, 0, 0, 0, 0, 0, 0, 0],
      earningsIds: ["", "", "", "", "", "", "", ""],
      yearsWorking: 1,
      industry: "",
      qualification: "",
    }
  }
  componentDidMount() {
    //retrieve all paths user has saved in planner
    datab.collection('pathPlans').where('user', '==', this.state.user.uid).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var myPaths = doc.data()
        this.setState({ myPaths: myPaths.list })
      })
    });
    this.onChangeIndustryFilter = this.onChangeIndustryFilter.bind(this);
    this.onChangeQualificationFilter = this.onChangeQualificationFilter.bind(this);
    this.handleUpdatePaths = this.handleUpdatePaths.bind(this)
    this.onChangeNoteInputBox = this.onChangeNoteInputBox.bind(this)
    this.onChangeEducationCost = this.onChangeEducationCost.bind(this)
    this.onChangeYearsWorking = this.onChangeYearsWorking.bind(this)
    this.onChangeCareerEarnings = this.onChangeCareerEarnings.bind(this)
    this.sortByIndustry = this.sortByIndustry.bind(this);
    this.sortByQualification = this.sortByQualification.bind(this);
    this.addToTotal = this.addToTotal.bind(this);
    this.addToEarnings = this.addToEarnings.bind(this);
  }
  addToTotal(event) {
    //update cost and corresponding costId list at correct position
    var cost = this.state.cost;
    var costIds = this.state.costIds;
    if (costIds[event.target.id] === event.target.name) {
      cost[event.target.id] = 0;
      costIds[event.target.id] = "";
    }
    else {
      cost[event.target.id] = event.target.value;
      costIds[event.target.id] = event.target.name;
    }
    this.setState({ cost: cost });
    this.setState({ costIds: costIds });
  }
  addToEarnings(event) {
    //update earnings and corresponding earnings list at correct position
    var earnings = this.state.earnings;
    var earningsIds = this.state.earningsIds;
    if (earningsIds[event.target.id] === event.target.name) {
      earnings[event.target.id] = 0;
      earningsIds[event.target.id] = "";
    }
    else {
      earnings[event.target.id] = event.target.value;
      earningsIds[event.target.id] = event.target.name;
    }
    this.setState({ earnings: earnings });
    this.setState({ earningsIds: earningsIds });
  }
  sortByIndustry(industryA, industryB) {
    let comparison = 0;
    if (this.state.industry != "") {
      //if an education object automatically swap
      if (industryA.education) {
        comparison = 1;
      }
      else {
        //only swap if one matches the dropdown selected
        if (industryA.industry == this.state.industry) comparison = -1;
        else if (industryB.industry == this.state.industry) comparison = +1;
        else comparison = 0;
      }
    }
    return comparison;
  }
  sortByQualification(qualificationA, qualificationB) {
    let comparison = 0;
    if (this.state.qualification != "") {
      //if an education object automatically swap
      if (!qualificationA.education) {
        comparison = 1;
      }
      else {
        //only swap if one matches the dropdown selected
        if (qualificationA.qualification == this.state.qualification) comparison = -1;
        else if (qualificationA.education && qualificationB.qualification == this.state.qualification) comparison = +1;
        else comparison = 0;
      }
    }
    return comparison;
  }
  onChangeIndustryFilter(event) {
    this.setState({ industry: event.target.value })
  }
  onChangeQualificationFilter(event) {
    this.setState({ qualification: event.target.value })
  }
  handleUpdatePaths(event) {
    try {
      if (this.state.user) {
        var uid = this.state.user.uid
        var myPaths = this.state.myPaths
        datab.collection('pathPlans').where("user", "==", uid)
          .get()
          .then(function (querySnapshot) {
            //only update if there are already valid entries in your saved paths
            if (querySnapshot.docs.length > 0) {
              querySnapshot.forEach(function (doc) {
                doc.ref.update({
                  user: uid,
                  list: myPaths,
                })
              });
            }
          })
      }
      window.alert("Successfully updated paths");
    }
    catch (error) {
      window.alert("Error occurred" + error.message);
    }
  }
  onChangeCareerEarnings(event) {
    //update corresponding index in myPaths as earnings changes
    var myPaths = this.state.myPaths;
    var name = event.target.name
    var split = name.split("|")
    var i = split[0]
    var j = split[1]
    var n = split[2]
    myPaths[i].details[j].earnings = event.target.value
    this.setState({ myPaths: myPaths })
    var earnings = this.state.earnings;
    //check if it is ticked and if so update it
    if (n == this.state.earningsIds[i]) {
      earnings[i] = event.target.value
    }
    this.setState({ earnings: earnings })
  }
  onChangeEducationCost(event) {
    //update corresponding index in myPaths as earnings changes
    var myPaths = this.state.myPaths;
    var id = event.target.id
    var split = id.split("_")
    var i = split[0]
    var j = split[1]
    myPaths[i].details[j].cost = event.target.value
    this.setState({ myPaths: myPaths })
    var cost = this.state.cost;
    //check if it is ticked and if so update it
    if (event.target.name == this.state.costIds[i]) {
      cost[i] = event.target.value
    }
    this.setState({ cost: cost })
  }
  onChangeNoteInputBox(event) {
    //update myPaths as notes change
    var myPaths = this.state.myPaths;
    var id = event.target.id
    var split = id.split("_")
    var i = split[0]
    var j = split[1]
    myPaths[i].details[j].notes = event.target.value
    this.setState({ myPaths: myPaths })
  }
  filterNextById(id) {
    //check if arrows point to valid objects
    var myPaths = this.state.myPaths
    for (var iter = 0; iter < myPaths.length; iter++) {
      var result = myPaths[iter].details.find(groupObj => {
        return groupObj.id === id;
      })
      if (result != undefined) {
        return true;
      }
    }
    return false;
  }
  onChangeYearsWorking(e) {
    this.setState({ yearsWorking: e.target.value })
  }

  render() {
    var totalCost = this.state.cost.reduce(reducer, 0);
    var nonNullEarnings = removeNull(this.state.earnings);
    var averageGrossEarnings = (nonNullEarnings.reduce(reducer, 0) / nonNullEarnings.length);
    var taxCredit = 3400;
    var lowerTaxDeduction = (Math.min(averageGrossEarnings, 36800)) * 0.2;
    var higherTaxDeduction = (Math.max(0, averageGrossEarnings - 36800)) * 0.4;
    var totalNetEarnings = averageGrossEarnings - (Math.max(0, lowerTaxDeduction + higherTaxDeduction - taxCredit));
    var yearsToPayOff = (Math.round((totalCost / totalNetEarnings) * 100)) / 100;
    var totalEarnings = (Math.round((totalNetEarnings * this.state.yearsWorking) * 100)) / 100;


    return (
      <div className='section'>
        <Container className="center">
          <Row>
            <h5>Here are all the different path objects that you've saved</h5>
            <p>Add your own notes and estimates. Tick to use in calculator</p>
          </Row>
          <Row>
            <Col>
              <label><b>Total Cost: </b></label>
              {totalCost > 0 && <Button className="form-control totalButton"> €{totalCost}</Button>}
            </Col>
            <Col>
              <div><label><b>Total Net Earnings: </b></label> {(!(isNaN(yearsToPayOff)) && <Button className="form-control totalButton"> €{totalEarnings}</Button>)}</div>
              {(!(isNaN(yearsToPayOff)) && <div><Form.Control className="form-control totalInput" type="number" min="0" max="99" value={this.state.yearsWorking}
                onChange={this.onChangeYearsWorking} /> <span>years working</span></div>)}
            </Col>
            <Col>
              <div><label><b>Years to pay off: </b></label>{(!(isNaN(yearsToPayOff)) && <Button className="form-control totalButton">{yearsToPayOff}</Button>)}</div>
            </Col>
            <Col>
              <Button className="button greyButton" onClick={this.handleUpdatePaths}>Save changes</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <FilterCourse qualification={this.state.qualification} nothingSelected={"All"} onChange={this.onChangeQualificationFilter} />
            </Col>
            <Col>
              <FilterCareer industry={this.state.industry} nothingSelected={"All"} onChange={this.onChangeIndustryFilter} />
            </Col>
            <table>
              <tbody>
                <tr className="block">
                  {this.state.myPaths && this.state.myPaths.map((n, index) => (
                    <td key={index}>
                      {n.details && n.details.sort(this.sortByQualification).sort(this.sortByIndustry).map((o, i) => (
                        <div key={i}>
                          {o.education && (
                            //check if education
                            <div className="map mapPurple center">
                              <input type="checkbox" id={index} name={o.id} value={(o.cost * (o.length / (o.numOfEntries || 1)))} onChange={this.addToTotal} checked={o.id == this.state.costIds[index]} />
                              <label className="lightFont">Cost per year (€):</label>
                              <Form.Control className="form-control plannerNumberInput" name={o.id} id={index + "_" + i} type="number" value={o.cost} onChange={this.onChangeEducationCost} />
                              <InstitionWebsite search={o.instituteName} />
                              <EduBox box={o} />
                              <TextareaAutosize className="stickyNote" value={o.notes} id={index + "_" + i} onChange={this.onChangeNoteInputBox} placeholder="Enter notes…" />
                              {o.nextItem && o.nextItem.map((nextIt, j) => (
                                <div key={j}>
                                  {(this.filterNextById(nextIt.id)) &&
                                    <Xarrow color={colourArray[i % colourArray.length]} start={o.id} end={nextIt.id} />
                                  }
                                </div>
                              ))}
                            </div>)}
                          {!o.education && (
                            //check if career object
                            <div className="map mapBlue center">
                              <input className="checkbox" type="checkbox" id={index} name={o.id} value={o.earnings} onChange={this.addToEarnings} checked={o.id == this.state.earningsIds[index]} />
                              <label className="lightFont">Annual Salary (€):</label>
                              <JobSearch search={o.jobTitle} name={index + "|" + i + "|" + o.id} earnings={o.earnings} onChange={this.onChangeCareerEarnings} />
                              <CarBox box={o} />
                              <TextareaAutosize className="stickyNote" value={o.notes} id={index + "_" + i} onChange={this.onChangeNoteInputBox} placeholder="Enter notes…" />
                              {o.nextItem && o.nextItem.map((nextIt, j) => (
                                <div key={j}>
                                  {this.filterNextById(nextIt.id) &&
                                    <Xarrow color={colourArray[i % colourArray.length]} start={o.id} end={nextIt.id} />
                                  }
                                </div>
                              ))}
                            </div>)}
                        </div>
                      ))}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </Row>
        </Container>
      </div>
    );
  }
}