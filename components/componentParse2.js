var assert = require('../utils').assert
var getId = require('../utils').getId
var checkNodeAvailability = require('../utils').checkNodeAvailability
var cacheInit = {}

var DOCUMENT_ELEMENT_TYPE = 1
var modelRaw = /\{\{model:([^{}]+)\}\}/g

function addEvent (node) {
  var nodeAttributes = node.attributes
  for (var i = nodeAttributes.length; i--;) {
    var a = nodeAttributes[i]
    var name = a.localName
    var ns = a.nodeValue
    if (/^k-/.test(name)) {
      var evtName = name.replace(/^k-/, '')
      var handler = ns.match(/[a-zA-Z]+(?![^(]*\))/)[0]
      var c = this[handler]
      console.log(c)
      if (c !== undefined && typeof c === 'function') {
        var h = ns.match(/\(([^{}]+)\)/)
        var handlerArgs = h ? h[1] : ''
        var argv = handlerArgs.split(',').filter(function (f) {
          return f !== ''
        })

        var fn = function (e) {
          e.stopPropagation()
          if (e.target !== e.currentTarget) {
            c.apply(this, [e.target, e])
          }
        }
        // if node is the rootNode for model, we wrap the eventListener and
        // rebuild the arguments by appending id/className util rootNode.
        if (node.hasChildNodes() && node.firstChild.nodeType !== DOCUMENT_ELEMENT_TYPE && node.firstChild.nodeValue.match(modelRaw)) {
          node.addEventListener(evtName, fn, false)
        } else {
          node.addEventListener(evtName, c.bind.apply(c.bind(this), [node].concat(argv)), false)
        }
        node.setAttribute('evt-node', '')
        if (node.hasAttribute('id')) {
          var p = this.__pristineFragment__.getElementById(node.id)
          if (!p.hasAttribute('evt-node')) {
            p.setAttribute('evt-node', '')
          }
        }
        // console.log(node)
      }
    }
  }
}

module.exports = function (componentStr, node) {
  var component = componentStr.replace('component:', '')
  var c = this[component]
  var el 
  var frag

  if (c !== undefined) {
    // check if sub-component node exist in the DOM


    // this is for initial component runner
    if(!cacheInit[component]){
      frag = document.createDocumentFragment()
      c.base = c.__pristineFragment__.cloneNode(true)
      c.render.call(c, frag)
      // console.log(c.base)
      cacheInit[component] = c.base.cloneNode(true)
      addEvent.call(c, cacheInit[component].firstChild)
      node.parentNode.replaceChild(cacheInit[component].cloneNode(true), node)
    } else {
      node.parentNode.replaceChild(cacheInit[component].cloneNode(true), node) 
      c.callBatchPoolUpdate()
    }
  } else {
    assert(false, 'Component ' + component + ' does not exist.')
  }
}
