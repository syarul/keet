var loopChilds = require('../utils').loopChilds

function lookupParentNode(rootNode, node, argv){
  while(node){
    if(node.className){
      argv.push(node.className)
    }
    if(node.id){
      argv.push(node.id)
    }
    node = node.parentNode
    if(node.isEqualNode(rootNode)){
      node = null
    }
  }
  return argv
}

var next = function (i, c, rem) {
  var hask
  var evtName
  var handler
  var handlerArgs
  var isHandler
  var argv
  var v
  var h
  var atts = c.attributes
  var self = this
  if (i < atts.length) {
    hask = /^k-/.test(atts[i].nodeName)
    if (hask) {
      evtName = atts[i].nodeName.replace(/^[^-]+-/, '')
      handler = atts[i].nodeValue.match(/[a-zA-Z]+(?![^(]*\))/)[0]
      h = atts[i].nodeValue.match(/\(([^{}]+)\)/)
      handlerArgs = h ? h[1] : ''
      isHandler = this[handler]
      if (typeof isHandler === 'function') {
        rem.push(atts[i].nodeName)
        argv = []
        v = handlerArgs.split(',').filter(function (f) { return f !== '' })
        if (v.length) v.map(function (v) { argv.push(v) })

        var fn = function(e){
          if (e.target !== e.currentTarget) {
            argv = lookupParentNode(c, e.target, [])
            isHandler.apply(self, argv.concat(e))
          }
          e.stopPropagation()
        }
        if(c.hasAttribute('evt-node')){
          c.addEventListener(evtName, fn, false)
        } else{
          c.addEventListener(evtName, isHandler.bind.apply(isHandler.bind(this), [c].concat(argv)), false)
        }
      }
    }
    i++
    next.apply(this, [ i, c, rem ])
  } else {
    rem.map(function (f) { c.removeAttribute(f) })
  }
}

module.exports = function (kNode) {
  var self = this
  var listKnodeChild = []
  var rem = []
  loopChilds(listKnodeChild, kNode)
  listKnodeChild.map(function (c) {
    if (c.nodeType === 1 && c.hasAttributes()) {
      next.apply(self, [ 0, c, rem ])
    }
  })
  listKnodeChild = []
}
