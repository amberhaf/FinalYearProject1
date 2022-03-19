const PreRenderMap = function preRenderMap(p, gp, uid) {
  var storedIds = []
  //loop through all paths inorder to group similar things together
  for (var h = 0; h < 8; h++) {
    gp.push([])
    for (var i = 0; i < p.length; i++) {
      if (p[i].list.length > h) {
        var result;
        var obj = p[i].list[h];
        for (var iter = 0; iter < gp.length; iter++) {
          //check if anything in thing in groupedPaths already matches this
          //perform education field checks if education
          if (obj.education) {
            result = gp[iter].find(groupObj => {
              return groupObj.instituteName === obj.instituteName && groupObj.qualification === obj.qualification && (compareTitles(groupObj.courseTitle, obj.courseTitle));
            })
          }
          //perform career field checks if career
          else {
            result = gp[iter].find(groupObj => {
              return groupObj.industry === obj.industry && groupObj.jobTitle === obj.jobTitle && (compareTitles(groupObj.companyName, obj.companyName));
            })
          }
          //if an object already matches update this
          if (result != undefined) {
            var insert=[]
            var index = gp[iter].indexOf(result)
            //access list of successors from grouped post
            var nextIt = result.nextItem
            if (p[i].list.length > h + 1) {
              //get the child to add to list of sucessors
              var nex = p[i].list[h + 1]
              if (nex.education === true) {
                //add any children to list of successors
                nextIt.push({ id: nex.instituteName + "_" + nex.qualification + "_" + nex.courseTitle })
                //check if the current user uploaded this 
                if (p[i].user === uid || storedIds.includes(insert.id)) {
                  gp[iter][index].currentUser = true;
                  //mark all successors to also fall under the current user when we get to it
                 for (var n = 0; n < nextIt.length; n++) {
                    storedIds.push(nextIt[n].id)
                  }
                }
              }
              else {
                //add any children to list of successors
                nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
                //check if the current user uploaded this 
                if (p[i].user === uid || storedIds.includes(insert.id)) {
                  gp[iter][index].currentUser = true;
                  //mark all successors to also fall under the current user when we get to it
                  for (var n = 0; n < nextIt.length; n++) {
                    storedIds.push(nextIt[n].id)
                  }                
                }
              }
            }
            gp[iter][index].nextItem = nextIt
            gp[iter][index].length = (parseInt(gp[iter][index].length) + parseInt(obj.length))
            gp[iter][index].numOfEntries = gp[iter][index].numOfEntries + 1
            break;
          }
        }
        //if nothing matches create a new object
        if (result === undefined) {
          var nextIt = []
          if (p[i].list.length > h + 1) {
            //get the child to add to list of sucessors
            var nex = p[i].list[h + 1]
            //add any children to list of successors
            if (nex.education === true) {
              nextIt.push({ id: nex.instituteName + "_" + nex.qualification + "_" + nex.courseTitle })
            }
            else {
              nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
            }
          }
          var insert;
          if (obj.education) {
            insert = { education: true, id: obj.instituteName + "_" + obj.qualification + "_" + obj.courseTitle, instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, length: obj.length, nextItem: nextIt, numOfEntries: 1, notes: "", cost: 0, website: "", currentUser: p[i].user === uid };
            //check if the current user uploaded this 
            if (p[i].user === uid || storedIds.includes(insert.id)) {
              insert.currentUser = true;
              //mark all successors to also fall under the current user when we get to it
              storedIds.push(obj.instituteName + "_" + obj.qualification + "_" + obj.courseTitle)
            }
          }
          else {
            insert = { education: false, id: obj.companyName + "_" + obj.industry + "_" + obj.jobTitle, companyName: obj.companyName, industry: obj.industry, jobTitle: obj.jobTitle, length: obj.length, numOfEntries: 1, nextItem: nextIt, notes: "", earnings: 0, website: "", currentUser: p[i].user === uid };
            //check if the current user uploaded this //check if the current user uploaded this 
            if (p[i].user === uid || storedIds.includes(insert.id)) {
              insert.currentUser = true;
              //mark all successors to also fall under the current user when we get to it
              storedIds.push(obj.companyName + "_" + obj.industry + "_" + obj.jobTitle)
            }
          }
          gp[h] = gp[h].concat(insert)
        }
      }
    }
  }
  return gp;
}


export default PreRenderMap;


function compareTitles(cname1, cname2) {
  //Convert to lowercase
  cname1 = cname1.toLowerCase();
  cname2 = cname2.toLowerCase();
  //perform stop word removal
  var stopwords = ["&", "&&", "and", "a", "an", "with", "through", "the", "of", "in", "from", "major", "majoring", "minor", "minoring", "single", "double", "course", "degree"];
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
  for (var j = 0; j < words.length; j++) {
    //remove punctuation
    var word_clean = words[j].split(/[^\w\s]|_/g).join("")
    if (!stopwords.includes(word_clean) && word_clean !== "") {
      res2.push(word_clean);
    }
  }
  if (res1.sort().join(',') === res2.sort().join(',')) {
    return true;
  }
  else return false;
};