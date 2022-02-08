import React from "react";
import Map from "../components/Map";
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import { datab, auth } from "../services/firebase";

function compareTitles(cname1, cname2) {
  //Convert to lowercase
  cname1 = cname1.toLowerCase();
  cname2 = cname2.toLowerCase();
  //perform stop word removal
  var stopwords = ["&", "&&","and", "a", "an", "with", "through", "the", "of", "in", "from", "major", "majoring", "minor", "minoring", "single", "double", "course", "degree"];
  var res1 = []
  var words = cname1.split(' ')
  for (var i = 0; i < words.length; i++) {
    //remove punctuation
    var word_clean = words[i].split(/[^\w\s]|_/g).join("")
    if (!stopwords.includes(word_clean) && word_clean !== "") {
      res1.push(word_clean);
    }
  }
  var res2 = []
  words = cname2.split(' ')
  for (var i = 0; i < words.length; i++) {
    //remove punctuation
    var word_clean = words[i].split(/[^\w\s]|_/g).join("")
    if (!stopwords.includes(word_clean) && word_clean !== "") {
      res2.push(word_clean);
    }
  }
  if (res1.sort().join(',') === res2.sort().join(',')) {
    return true;
  }
  else return false;
};

class PathMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      groupedEducation: [],
      groupedCareer: []
    };
  }
  componentDidMount() {
    datab.collection('path').get().then(querySnapshot => {
      let allPosts = [];
      querySnapshot.forEach(doc => {
        allPosts.push(doc.data())
      })
      this.setState({ posts: allPosts })
    }).then(() => {
      var p = this.state.posts
      var gp = this.state.groupedEducation
      for (var h = 0; h < 4; h++) {
        gp.push([])
        for (var i = 0; i < p.length; i++) {
          if (p[i].eduList.length > h) {
            var result;
            var obj = p[i].eduList[h];
            for (var iter = 0; iter < gp.length; iter++) {
              result = gp[iter].find(groupObj => {
                return groupObj.instituteName === obj.instituteName && groupObj.qualification === obj.qualification && (compareTitles(groupObj.courseTitle, obj.courseTitle));
              })
              if (result != undefined) {
                var index = gp[iter].indexOf(result)
                var nextIt = result.nextItem
                if (p[i].eduList.length > h + 1) {
                  var nex = p[i].eduList[h + 1]
                  nextIt.push({ id: nex.instituteName + "_" + nex.qualification + "_" + nex.courseTitle })
                }
                else if (p[i].carList.length > 0) {
                  var nex = p[i].carList[0]
                  nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
                }
                gp[iter][index].nextItem = nextIt
                gp[iter][index].courseLength = (parseInt(gp[iter][index].courseLength) + parseInt(obj.courseLength))
                gp[iter][index].numOfEntries = gp[iter][index].numOfEntries + 1
                break;
              }
            }
            if (result === undefined) {
              var nextIt = []
              if (p[i].eduList.length > h + 1) {
                var nex = p[i].eduList[h + 1]
                nextIt.push({ id: nex.instituteName + "_" + nex.qualification + "_" + nex.courseTitle })
              }
              else if (p[i].carList.length > 0) {
                var nex = p[i].carList[0]
                nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
              }
              var insert = { id: obj.instituteName + "_" + obj.qualification + "_" + obj.courseTitle, instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, courseLength: obj.courseLength, nextItem: nextIt, numOfEntries: 1, notes: "", cost: 0, website: "" };
              gp[h] = gp[h].concat(insert)
            }
          }
        }
      }
      //
      this.setState({ groupedEducation: gp });
      var gc = this.state.groupedCareer
      for (var h = 0; h < 4; h++) {
        gc.push([])
        for (var i = 0; i < p.length; i++) {
          if (p[i].carList.length > h) {
            var obj = p[i].carList[h];
            for (var iter = 0; iter <= h; iter++) {
              var result = gc[iter].find(groupObj => {
                return groupObj.industry === obj.industry && groupObj.jobTitle === obj.jobTitle && (compareTitles(groupObj.companyName, obj.companyName));
              })
              if (result != undefined) {
                var index = gc[iter].indexOf(result)
                var nextIt = result.nextItem
                if (p[i].carList.length > h + 1) {
                  var nex = p[i].carList[h + 1]
                  nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
                }
                gc[iter][index].nextItem = nextIt
                gc[iter][index].jobLength = parseInt(gc[iter][index].jobLength) + parseInt(obj.jobLength)
                gc[iter][index].numOfEntries = gc[iter][index].numOfEntries + 1
                break;
              }
            }
            if (result == undefined) {
              var nextIt = []
              if (p[i].carList.length > h + 1) {
                var nex = p[i].carList[h + 1]
                nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
              }
              var insert = { id: obj.companyName + "_" + obj.industry + "_" + obj.jobTitle, companyName: obj.companyName, industry: obj.industry, jobTitle: obj.jobTitle, jobLength: obj.jobLength, numOfEntries: 1, nextItem: nextIt, notes: "", earnings: 0, website: "" };
              gc[h] = gc[h].concat(insert)
            }
          }
        }
      }
      this.setState({ groupedCareer: gc });
    });
    if (this.state.user) {
      datab.collection('pathPlans').where('user', '==', this.state.user.uid).get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          this.setState({ myEdus: doc.data().eduList })
          this.setState({ myCars: doc.data().carList })
        })
      });
    }
  }

  render() {
    return (
      <div>
        <Header />
        <Welcome />
        <Map showPlanUpdater={auth().currentUser} groupedEducation={this.state.groupedEducation} groupedCareer={this.state.groupedCareer} />
      </div>
    );
  }
}
export default PathMap;