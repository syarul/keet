module.exports = function(argv) {
  var cop = function(v){
    var o = {}
    if(typeof v !== 'object'){
      o.copy = v
      return o.copy
    }else {
      for(var attr in v){
        o[attr] = v[attr]
      }
    }
    return o
  }
  return Array.isArray(argv) ? argv.map(function(v) {
    return v
  }) : cop(argv)
}