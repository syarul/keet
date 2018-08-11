var assert = require('../utils').assert
var getId = require('../utils').getId
module.exports = function (componentStr, node) {
  var component = componentStr.replace('component:', '')
  var c = this[component]
  var el 
  var frag
  if (c !== undefined) {
  	// check if sub-component node exist in the DOM
  	el = getId(c.el)
  	if(el){
  	  // replace it with the rootNode of sub-component
  	  node.parentNode.replaceChild(el.cloneNode(), node)
  	  return
  	}
    frag = document.createDocumentFragment()
    c.base = c.__pristineFragment__.cloneNode(true)
    c.render.call(c, frag)
    node.parentNode.replaceChild(frag, node)
  } else {
    assert(false, 'Component ' + component + ' does not exist.')
  }
}
