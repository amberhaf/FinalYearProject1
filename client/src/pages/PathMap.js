import React from "react";
import Map from "../components/Map";
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import PreRenderMap from "../components/Functions";
import { datab, auth } from "../services/firebase";

class PathMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      groupedPosts: [],
      allSelected: true
    };
    this.changeDisplayAll= this.changeDisplayAll.bind(this);
    this.changeDisplayMine= this.changeDisplayMine.bind(this);
  }
  componentDidMount() {
    var uid = ""
    if(this.state.user)
    {
      var uid = this.state.user.uid
    }
    datab.collection('path').get().then(querySnapshot => {
      let allPosts = [];
      querySnapshot.forEach(doc => {
        allPosts.push(doc.data())
      })
      this.setState({ posts: allPosts })
    }).then(() => {
      var p = this.state.posts
    })
    datab.collection('pathIntertwined').get().then(querySnapshot => {
      let allPosts = [];
      querySnapshot.forEach(doc => {
        allPosts.push(doc.data())
      })
      this.setState({ posts: allPosts })
    }).then(() => {
      var p = this.state.posts
      var gp = this.state.groupedPosts
      PreRenderMap(p, gp, uid);
      this.setState({ groupedPosts: gp });
    });
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

  render() {
    return (
      <div>
        <Header />
        <Welcome />
        {auth().currentUser && (<div className="center"><button onClick={this.changeDisplayAll} className={this.state.allSelected ? "" : "button"}>All Paths</button>
        <button onClick={this.changeDisplayMine} className={!this.state.allSelected ? "" : "button"}>My Paths</button></div>)}
        <Map allSelected={this.state.allSelected} showPlanUpdater={auth().currentUser} groupedPosts={this.state.groupedPosts}/>
      </div>
    );
  }
}
export default PathMap;