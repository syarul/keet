var cat = function() {
    return [].slice.call(arguments).join('')
  }

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = cat
  }
  exports.cat = cat
}