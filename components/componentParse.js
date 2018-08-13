var assert = require('../utils').assert
var getId = require('../utils').getId
var checkNodeAvailability = require('../utils').checkNodeAvailability
var tmplHandler = require('./tmplHandler')
var cacheInit = {}
module.exports = function (componentStr, node) {
  var component = componentStr.replace('component:', '')
  var c = this[component]
  var el 
  var frag

  if (c !== undefined) {
    // this is for initial component runner
    if(!cacheInit[c.ID]){
      c.render.call(c, true)
      cacheInit[c.ID] = c.base.cloneNode(true)
      node.parentNode.replaceChild(c.base, node)
    } else {
      // we need to reattach event listeners if the node is not available on DOM
      if(!getId(this[component].el)){
        c.base = c.__pristineFragment__.cloneNode(true)
        c.render.call(c, true)
        node.parentNode.replaceChild(c.base, node)
      } else {
        node.parentNode.replaceChild(cacheInit[c.ID].cloneNode(true), node) 
      }
    }
    // inform sub-component to update
    c.callBatchPoolUpdate()
  } else {
    assert(false, 'Component ' + component + ' does not exist.')
  }
}
