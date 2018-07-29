var setState = require('./genElement').setState
var tmplHandler = require('./tmplHandler')
var processEvent = require('./processEvent')
var getId = require('./utils').getId
var testEvent = require('./utils').testEvent
var componentParse = require('./componentParse')
var modelParse = require('./modelParse')
var nodesVisibility = require('./nodesVisibility')
var checkNodeAvailability = require('./utils').checkNodeAvailability

module.exports = function (stub) {
  var self = this
  var el
  var tpl
  if (typeof this.base === 'string') {
    this.__stateList__ = this.__stateList__ || []
    this.__modelList__ = this.__modelList__ || []
    this.__componentList__ = this.__componentList__ || []
    this.__componentStub__ = this.__componentStub__ || {}
    tpl = tmplHandler.call(this, this.base, function (state) {
      self.__stateList__ = self.__stateList__.concat(state)
    })
    tpl = componentParse.call(this, tpl)
    tpl = modelParse.call(this, tpl)
    tpl = nodesVisibility.call(this, tpl)
    if (stub) {
      return tpl
    } else {
      el = getId(this.el)
      if (el) {
        el.innerHTML = tpl
        this.__componentList__.map(function (component) {
          var c = self[component]
          if (c) {
            // do initial checking of the node availability
            checkNodeAvailability(c.el, function () {
              c.stubRender(self.__componentStub__[component])
            })
          }
        })
        setState.call(this)
        testEvent(tpl) && processEvent.call(this, el)
      }
    }
  }
}
