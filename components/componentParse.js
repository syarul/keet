var assert = require('../utils').assert
module.exports = function (componentStr, node) {
  var component = componentStr.replace('component:', '')
  if (this[component] !== undefined) {
    var frag = document.createDocumentFragment()
    this[component].render.call(this[component], frag)
    node.parentNode.replaceChild(frag, node)
    // console.log(this[component], frag)
  } else {
    assert(false, 'Component ' + component + ' does not exist.')
  }
}
