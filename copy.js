var copy = function(argv) {
  var clone = function(v) {
    var o = {}
    if(typeof v !== 'object'){
      o.copy = v
      return o.copy
    } else {
      for(var attr in v){
        o[attr] = v[attr]
      }
      return o
    }
  }
  return Array.isArray(argv) ? argv.map(function(v) {
    return v
  }) : clone(argv)
}

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = copy
  }
  exports.copy = copy
}