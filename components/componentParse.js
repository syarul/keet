var assert = require('../utils').assert
var getId = require('../utils').getId
var checkNodeAvailability = require('../utils').checkNodeAvailability
var cacheInit = {}
module.exports = function (componentStr, node) {
  var component = componentStr.replace('component:', '')
  var c = this[component]
  var el 
  var frag

  if (c !== undefined) {
    // check if sub-component node exist in the DOM

    // this is for initial component runner
    if(!cacheInit[component]){
      // frag = document.createDocumentFragment()
      // c.base = c.__pristineFragment__.cloneNode(true)
      c.render.call(c, true)
      console.log(c.base)
      cacheInit[component] = c.base.cloneNode(true)
      node.parentNode.replaceChild(c.base, node)
    } else {
      node.parentNode.replaceChild(cacheInit[component].cloneNode(true), node) 
      c.callBatchPoolUpdate()
    }
  } else {
    assert(false, 'Component ' + component + ' does not exist.')
  }
}
