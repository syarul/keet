var loopChilds = require('./elementUtils').loopChilds

module.exports = function (kNode) {
  var self = this
  var listKnodeChild = []
  var rem = []
  loopChilds(listKnodeChild, kNode)
  listKnodeChild.map(function (c) {
    if (c.nodeType === 1 && c.hasAttributes()) {
      for(var i = 0, atts = c.attributes, len = atts.length; i < len; i++){
        
        var evtName
        var evthandler
        var handler
        var isHandler
        var argv
        var v

        var hask = /^k-/.test(atts[i].nodeName)

        if (hask) {
          evtName = atts[i].nodeName.split('-')[1]
          evthandler = atts[i].nodeValue
          handler = evthandler.split('(')
          isHandler = self[handler[0]]
          if (typeof isHandler === 'function') {
            rem.push(atts[i].nodeName)
            argv = []
            v = handler[1].slice(0, -1).split(',').filter(function (f) { return f !== '' })
            if (v.length) v.map(function (v) { argv.push(v) })
            c.addEventListener(evtName, isHandler.bind.apply(isHandler.bind(self), [c].concat(argv)), false)
          }
        }

        if(i === len - 1){
          rem.map(function (f) { c.removeAttribute(f) })
        }
        
      }
    }
  })
  listKnodeChild = []
}
