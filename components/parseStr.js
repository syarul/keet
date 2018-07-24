var genElement = require('./genElement').genElement
var setState = require('./genElement').setState
var tmplHandler = require('./tmplHandler')
var processEvent = require('./processEvent')
var genId = require('./utils').genId
var genTemplate = require('./genTemplate')
var nodesVisibility = require('./nodesVisibility')
var sum = require('hash-sum')

module.exports = function () {
  var self = this
  var elemArr = []
  var args = [].slice.call(arguments)
  if (Array.isArray(this.base.model)) {
    // do array base
    this.base.template = this.base.template.trim().replace(/\s+/g, ' ')

    // generate id for selector
    this.base.model = this.base.model.map(function (m) {
      m['keet-id'] = genId()
      return m
    })
    this.base.model.map(function (m) {
      elemArr.push(genTemplate.call(self, m))
    })
  } else if (typeof this.base === 'object') {
    // do object base
    Object.keys(this.base).map(function (key) {
      var child = self.base[key]
      if (child && typeof child === 'object') {
        var id = genId()
        child['keet-id'] = id
        self.base[key]['keet-id'] = id
        var newElement = genElement.apply(self, [child].concat(args))
        elemArr.push(newElement)
      } else {
        self.__stateList__ = []
        var tpl = tmplHandler.call(self, child, function (state) {
          self.__stateList__ = self.__stateList__.concat(state)
        })
        tpl = nodesVisibility.call(self, tpl)
        var tempDiv = document.createElement('div')
        tempDiv.innerHTML = tpl
        setState.call(self, args)
        processEvent.call(self, tempDiv)
        tempDiv.childNodes.forEach(function (c) {
          if (c.nodeType === 1) {
            c.setAttribute('data-checksum', sum(c.outerHTML))
          }
          elemArr.push(c)
        })
      }
    })
  } else if (typeof this.base === 'string') {
    this.__stateList__ = []
    var tpl = tmplHandler.call(this, this.base, function (state) {
      self.__stateList__ = self.__stateList__.concat(state)
    })

    tpl = nodesVisibility.call(this, tpl)
    var tempDiv = document.createElement('div')
    tempDiv.innerHTML = tpl
    setState.call(this, args)
    processEvent.call(this, tempDiv)
    tempDiv.childNodes.forEach(function (c) {
      if (c.nodeType === 1) {
        c.setAttribute('data-checksum', sum(c.outerHTML))
      }
      elemArr.push(c)
    })
  }

  return elemArr
}
