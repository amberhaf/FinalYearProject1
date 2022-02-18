export const Updatefilter= function updatefilter(gp, selectedQualification, selectedIndustry){    
  var filterStoredIds=[]
  for (var h = 0; h < gp.length; h++) {
    for (var i = 0; i < gp[h].length; i++) {
        var obj =  gp[h][i];
        obj.filterMatch=false
          if(obj.education)
          {
            if(obj.qualification === selectedQualification || filterStoredIds.includes(obj.id) || (selectedQualification==="" && obj.nextItem))
            {
              obj.filterMatch=true;
              for(var n=0; n<obj.nextItem.length; n++)
              {
                  filterStoredIds.push(obj.nextItem[n].id)
              }
            }
          }
          else
          {
            if(obj.industry === selectedIndustry || filterStoredIds.includes(obj.id) || (selectedIndustry==="" && obj.nextItem))
            {
              obj.filterMatch=true;
              for(var n=0; n<obj.nextItem.length; n++)
              {
                  filterStoredIds.push(obj.nextItem[n].id)
              }
            }
          }
          gp[h][i] = obj;
      }
  }
  gp.push([[]]);
  return gp;
}

export default Updatefilter;