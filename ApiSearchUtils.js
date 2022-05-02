let searchUtils = { 

    filterUsingAllParams: function (sheet, params) {
    let result = sheet;
    for (let key of Object.keys(params)) {
      const value = params[key];
      if (value.indexOf('*') > 0){
        result = searchUtils.filterDataWildCard(key, value,result);
      }else{
        result = searchUtils.filterData(key, value,result);
      }
      
    }
    return result;
  },
  
  filterData : function (key,value,result){
    let rows =  result.filter( result => result[key] === value );
    return rows;
  },

  filterDataWildCard : function (key,value,result){
    let rows =  result.filter( function(element){
        return element[key].includes(value.slice(0,-1)) ;
    });
    return rows;
  }

 
  
}

module.exports = searchUtils;