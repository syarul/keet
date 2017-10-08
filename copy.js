module.exports = function(argv) {
  var cop = function(v){
    var o = {}
    for(var attr in v){
      o[attr] = v[attr]
    }
    return o
  }
  var clone = function(v) {
    return typeof v == 'object' && cop(v)
  }
  return clone(argv)
}