module.exports = function(argv) {
  var clone = function(v) {
    var o = {}
    o.copy = v
    return o.copy
  }
  return Array.isArray(argv) ? argv.map(function(v) {
    return v
  }) : clone(argv)
}