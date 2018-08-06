var setState = require('./genElement').setState
var tmplHandler = require('./tmplHandler')
var processEvent = require('./processEvent')
var getId = require('../utils').getId
var testEvent = require('../utils').testEvent
var componentParse = require('./componentParse')
// var modelParse = require('./modelParse')
// var nodesVisibility = require('./nodesVisibility')
var checkNodeAvailability = require('../utils').checkNodeAvailability
var addState =  require('./genElement').addState
var assert = require('../utils').assert

var renderSub = function (c, cName, node) {
  c.stubRender(this.__componentStub__[cName], node)
}

module.exports = function (stub) {

  // this.__stateList__ = this.__stateList__ || []
  // this.__modelList__ = this.__modelList__ || []
  // this.__componentList__ = this.__componentList__ || []
  // this.__componentStub__ = this.__componentStub__ || {}
  var el = getId(this.el)

  tmplHandler(this, el, addState)


  if(el){
    // listen to state changes
    setState.call(this)
    // mount fragment to DOM
    // el.appendChild(this.base)
    // since component already rendered, trigger its life-cycle method
    if (this.componentDidMount && typeof this.componentDidMount === 'function') {
      this.componentDidMount()
    }
  } else {
    assert(false, 'No element with id: "' + this.el + '" exist.')
  }
  return 
  // tpl = tmplHandler.call(this, function (state) {
  //   if (!~self.__stateList__.indexOf(state)) self.__stateList__ = self.__stateList__.concat(state)
  // })
  // tpl = componentParse.call(this, tpl)
  // tpl = modelParse.call(this, tpl)
  // tpl = nodesVisibility.call(this, tpl)
  if (stub) {
    return tpl
  } else {
    el = getId(this.el)
    if (el) {
      el.innerHTML = tpl
      // this.__componentList__.map(function (componentName) {
      //   var component = self[componentName]
      //   if (component) {
      //     // do initial checking of the node availability
      //     var node = checkNodeAvailability(component, componentName, renderSub.bind(self))
      //     if (node) renderSub.call(self, component, componentName, node)
      //   }
      // })
      setState.call(this)
      testEvent(tpl) && processEvent.call(this, el)

      // since component already rendered, trigger its life-cycle method
      if (this.componentDidMount && typeof this.componentDidMount === 'function') {
        this.componentDidMount()
      }
    }
  }
  
}
