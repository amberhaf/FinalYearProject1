const PreRenderMap = function preRenderMap(p, gp, uid){
    var storedIds=[]
    for (var h = 0; h < 8; h++) {
      gp.push([])
      for (var i = 0; i < p.length; i++) {
        if (p[i].list.length > h) {
          var result;
          var obj = p[i].list[h];
          for (var iter = 0; iter < gp.length; iter++) {
            if(obj.education)
            {
              result = gp[iter].find(groupObj => {
                return groupObj.instituteName === obj.instituteName && groupObj.qualification === obj.qualification && (compareTitles(groupObj.courseTitle, obj.courseTitle));
              })
            }
            else{
              result = gp[iter].find(groupObj => {
                return groupObj.industry === obj.industry && groupObj.jobTitle === obj.jobTitle && (compareTitles(groupObj.companyName, obj.companyName));
              })
            }
            if (result != undefined) {
              var index = gp[iter].indexOf(result)
              var nextIt = result.nextItem
              if (p[i].list.length > h + 1) {
                var nex = p[i].list[h + 1]
                if(nex.education===true)
                {
                  nextIt.push({ id: nex.instituteName + "_" + nex.qualification + "_" + nex.courseTitle })
                }
                else
                {
                  nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
                }
              }
              if(p[i].user === uid || storedIds.includes(gp[iter][index].id))
              {
                gp[iter][index].currentUser=true;
                //add id to the list of acceptable ids
                storedIds.push(nextIt.id)
              }
              gp[iter][index].nextItem = nextIt
              gp[iter][index].length = (parseInt(gp[iter][index].length) + parseInt(obj.length))
              gp[iter][index].numOfEntries = gp[iter][index].numOfEntries + 1
              break;
            }
          }
          if (result === undefined) {
            var nextIt = []
            if (p[i].list.length > h + 1) {
              var nex = p[i].list[h + 1]
              if(nex.education===true)
              {
                nextIt.push({ id: nex.instituteName + "_" + nex.qualification + "_" + nex.courseTitle })
              }
              else
              {
                nextIt.push({ id: nex.companyName + "_" + nex.industry + "_" + nex.jobTitle })
              }              }
            //add id to the list of acceptable ids
            var insert;
            if(obj.education)
            {
              insert={ education: true, id: obj.instituteName + "_" + obj.qualification + "_" + obj.courseTitle, instituteName: obj.instituteName, qualification: obj.qualification, courseTitle: obj.courseTitle, length: obj.length, nextItem: nextIt, numOfEntries: 1, notes: "", cost: 0, website: "" , currentUser: p[i].user === uid};
            }
            else
            {
              insert = { education: false, id: obj.companyName + "_" + obj.industry + "_" + obj.jobTitle, companyName: obj.companyName, industry: obj.industry, jobTitle: obj.jobTitle, length: obj.length, numOfEntries: 1, nextItem: nextIt, notes: "", earnings: 0, website: "", currentUser: p[i].user === uid};       
            }
            if(p[i].user === uid || storedIds.includes(insert.id))
            {
              insert.currentUser=true;
              //add id to the list of acceptable ids
              storedIds.push(nextIt.id)
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