var genElement = require('./genElement').genElement
var setState = require('./genElement').setState
var tmplHandler = require('./tmplHandler')
var processEvent = require('./processEvent')
var genId = require('./utils').genId
var genTemplate = require('./genTemplate')
var injectIdentifier = require('./injectIdentifier')

module.exports = function () {
  if (typeof this.base !== 'object') throw new Error('instance is not an object')
  var self = this
  var elemArr = []
  var args = [].slice.call(arguments)
  if (Array.isArray(this.base.model)) {
    // do array base
    this.base.template = this.base.template.trim().replace(/\s+/g, ' ')

    // staging for all states
    this.__stateList__ = this.base.template.match(/{{([^{}]+)}}/g)

    // generate id for selector
    this.base.model = this.base.model.map(function (m) {
      m['keet-id'] = genId()
      return m
    })
    this.base.model.map(function (m) {
      elemArr.push(genTemplate.call(self, m))
    })
  } else {
    // map the the vmodel object
    Object.keys(this.base).map(function (key) {
      var child = self.base[key]
      if (child && typeof child === 'object') {
        // handle vmodel that structured based on object hierarchies
        var id = genId()
        child['keet-id'] = id
        self.base[key]['keet-id'] = id
        var newElement = genElement.apply(self, [child].concat(args))
        elemArr.push(newElement)
      } else {
        // handle vmodel that structured based on string
        self.__stateList__ = []

        self.__identStores__ = []

        // rebuild the string with identifier node
        var tempDiv = injectIdentifier.call(self, child, function (state) {
          self.__stateList__ = self.__stateList__.concat(state)
        })  

        // var tpl = tmplHandler.call(self, child, function (state) {
        //   self.__stateList__ = self.__stateList__.concat(state)
        // })
        // var tempDiv = document.createElement('div')
        // tempDiv.innerHTML = tpl
        setState.call(self, args)
        // processEvent.call(self, tempDiv)
        tempDiv.childNodes.forEach(function (c) {
          elemArr.push(c)
        })
      }
    })
  }

  return elemArr
}
