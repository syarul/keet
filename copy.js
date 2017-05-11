var copy = function(argv) {
  var clone = function(v) {
    var o = {}
    o.copy = v
    return o.copy
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