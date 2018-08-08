var assert = require('../utils').assert
module.exports = function(componentStr, node){
  var component = componentStr.replace('component:', '')
  if(this[component] !== undefined){
    var frag = document.createDocumentFragment()
    this[component].render(frag)
    // node.parentNode.insertBefore(frag, null)
    console.log(node, frag)
  } else {
    assert(false, 'Component '+component+' does not exist.')
  }
}