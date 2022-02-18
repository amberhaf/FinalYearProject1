import React from "react";
import Map from "../components/Map";
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import UpdateFilter from "../components/Functions2";
import PreRenderMap from "../components/Functions";
import { datab, auth } from "../services/firebase";
import { FilterCareer, FilterCourse } from '../components/FilterDropDown';
import {Button, Container, Table, Row, Col} from 'react-bootstrap';

class PathMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      groupedPosts: [[]],
      allSelected: true,
      industry: "",
      qualification: "",
      key: 0
    };
    this.changeDisplayAll= this.changeDisplayAll.bind(this);
    this.changeDisplayMine= this.changeDisplayMine.bind(this);
    this.onChangeIndustryFilter = this.onChangeIndustryFilter.bind(this);  
    this.onChangeQualificationFilter = this.onChangeQualificationFilter.bind(this); 
  }
  componentDidMount() {
    var _this = this;
    var uid = ""
    if(this.state.user)
    {
      uid = this.state.user.uid
    }
    datab.collection('pathIntertwined').get().then(querySnapshot => {
      let allPosts = [];
      querySnapshot.forEach(doc => {
        allPosts.push(doc.data())
      })
      this.setState({ posts: allPosts })
    }).then(() => {            
      var p = _this.state.posts
      var gp= this.state.groupedPosts
      var qualification=this.state.qualification
      var industry=this.state.industry
      PreRenderMap(p, gp, uid, qualification, industry);
      this.setState({ groupedPosts: gp });
      this.setState({ key: Math.random() });
  })      
  .catch((error) => {
    window.alert("Error occurred"+ error.message );
  })
    if (this.state.user) {
      datab.collection('pathPlans').where('user', '==', this.state.user.uid).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({ myPaths: doc.data().list })
        })
      });
    }
  }
  changeDisplayMine(){
    this.setState({allSelected: false});
  }
  changeDisplayAll(){
    this.setState({allSelected: true});
  }
  onChangeIndustryFilter(event) {
    this.setState({industry: event.target.value})
    this.setState({ key: Math.random() });
  }
  onChangeQualificationFilter(event){
    this.setState({qualification: event.target.value})
    this.setState({ key: Math.random() });
  }

  render() {
    return (
      <div>
        <Header />
        <Welcome />
        {auth().currentUser && (<div className="center"><button onClick={this.changeDisplayAll} className={this.state.allSelected ? "" : "button"}>All Paths</button>
        <button onClick={this.changeDisplayMine} className={!this.state.allSelected ? "" : "button"}>My Paths</button></div>)}
        <Container>
        <Row>
        <Col>
          <FilterCourse qualification={this.state.qualification} nothingSelected={"All"} onChange={this.onChangeQualificationFilter} />
        </Col>
        <Col>
          <FilterCareer industry={this.state.industry} nothingSelected={"All"} onChange={this.onChangeIndustryFilter} />
        </Col>
        </Row>
        </Container>
        <Map key={this.state.key} allSelected={this.state.allSelected} showPlanUpdater={auth().currentUser} groupedPosts={this.state.groupedPosts} qualification={this.state.qualification} industry={this.state.industry}/>
      </div>
    );
  }
}
export default PathMap;