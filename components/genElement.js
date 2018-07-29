var tmplHandler = require('./tmplHandler')
var processEvent = require('./processEvent')
var getId = require('./utils').getId
var testEvent = require('./utils').testEvent
var strInterpreter = require('./strInterpreter')
var componentParse = require('./componentParse')
var modelParse = require('./modelParse')
var nodesVisibility = require('./nodesVisibility')
var morph = require('morphdom')

var updateContext = function () {
  var self = this
  var ele = getId(this.el)
  var newElem = genElement.call(this, this.base)
  newElem.id = self.el
  morph(ele, newElem)
  batchPool.status = 'ready'
}

// batch pool update states to DOM
var batchPool = {
  ttl: null,
  status: 'ready'
}

var batchPoolExec = function () {
  var self = this
  if (batchPool.status === 'pooling') {

  } else {
    batchPool.status = 'pooling'
    clearTimeout(batchPool.ttl)
    batchPool.ttl = setTimeout(function () {
      updateContext.call(self)
    }, 0)
  }
}

var nextState = function (i) {
  var self = this
  if (i < this.__stateList__.length) {
    var state = this.__stateList__[i]
    var value = this[state]
    // if value is undefined, likely has object notation we convert it to array
    if (value === undefined) value = strInterpreter(state)

    if (value && Array.isArray(value)) {
      // using split object notation as base for state update
      var inVal = this[value[0]][value[1]]
      Object.defineProperty(this[value[0]], value[1], {
        enumerable: false,
        configurable: true,
        get: function () {
          return inVal
        },
        set: function (val) {
          inVal = val
          batchPoolExec.call(self)
        }
      })
    } else {
      // handle parent state update if the state is not an object
      Object.defineProperty(this, state, {
        enumerable: false,
        configurable: true,
        get: function () {
          return value
        },
        set: function (val) {
          value = val
          batchPoolExec.call(self)
        }
      })
    }
    i++
    nextState.call(this, i)
  }
}

var setState = function (args) {
  nextState.call(this, 0)
}

var updateStateList = function (state) {
  this.__stateList__ = this.__stateList__.concat(state)
}

var genElement = function (template) {
  var tempDiv = document.createElement('div')
  var tpl = tmplHandler.call(this, template, updateStateList.bind(this))
  tpl = componentParse.call(this, tpl)
  tpl = modelParse.call(this, tpl)
  tpl = nodesVisibility.call(this, tpl)
  tempDiv.innerHTML = tpl

  setState.call(this)
  testEvent(tpl) && processEvent.call(this, tempDiv)
  return tempDiv
}

exports.genElement = genElement
exports.setState = setState
exports.updateStateList = updateStateList
