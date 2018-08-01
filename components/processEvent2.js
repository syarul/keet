var loopChilds = require('../utils').loopChilds

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
        c.addEventListener(evtName, isHandler.bind.apply(isHandler.bind(this), [c].concat(argv)), false)
      }
    }
    i++
    next.apply(this, [ i, c, rem ])
  } else {
    rem.map(function (f) { c.removeAttribute(f) })
  }
}

function loop(kNode) {
  var checkNode
  var i, a, ns, name, nodeAttributes, evtName,
  h, handlerArgs, argv, c
  // var listKnodeChild = []
  // var rem = []
  // loopChilds(listKnodeChild, kNode)
  // listKnodeChild.map(function (c) {
  //   if (c.nodeType === 1 && c.hasAttributes()) {
  //     next.apply(self, [ 0, c, rem ])
  //   }
  // })
  // listKnodeChild = []
  var node = kNode.firstChild

  while(node){
    checkNode = node
    node = node.nextSibling
    if(checkNode.nodeType === 1 && checkNode.hasAttributes() && !checkNode.hasAttribute('evt-node')){
      nodeAttributes = checkNode.attributes
      for (i = nodeAttributes.length; i--;) {
        a = nodeAttributes[i]
        name = a.localName
        ns = a.nodeValue
        if (/^k-/.test(name)) {
          evtName = name.replace(/^k-/, '')
          handler = ns.match(/[a-zA-Z]+(?![^(]*\))/)[0]
          c = this[handler]
          if(c){
            h = ns.match(/\(([^{}]+)\)/)
            handlerArgs = h ? h[1] : ''
            argv = handlerArgs.split('')
            checkNode.addEventListener(evtName, c.bind.apply(c.bind(this), [checkNode].concat(argv)), false)
            checkNode.setAttribute('evt-node', '')
            // checkNode.removeAttribute(name)
          }
        }
      }
      if (checkNode.hasChildNodes()) {
        loop.call(this, checkNode)
      }
    }
  }
}

module.exports = loop
