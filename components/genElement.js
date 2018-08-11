var tmplHandler = require('./tmplHandler')
var strInterpreter = require('./strInterpreter')
var morph = require('set-dom')
var getId = require('../utils').getId
var trottle = require('../utils').trottle

var override
var el

var morpher = function () {
  // console.time('r')
  el = getId(this.el)
  genElement.call(this)
  if(el) {
    this.IS_STUB ? morph(el, this.base.firstChild) : morph(el, this.base)
  }
  // exec life-cycle componentDidUpdate
  if (this.componentDidUpdate && typeof this.componentDidUpdate === 'function') {
    this.componentDidUpdate()
  }
  // console.timeEnd('r')
}

var updateContext = trottle(morpher, 1)

var nextState = function (i) {
  var state
  var value
  if (i < stateList.length) {
    state = stateList[i]
    value = this[state]

    // if value is undefined, likely has object notation we convert it to array
    if (value === undefined) value = strInterpreter(state)

    if (value && Array.isArray(value)) {
      // using split object notation as base for state update
      // console.log(value)
      var inVal = this[value[0]][value[1]]
      Object.defineProperty(this[value[0]], value[1], {
        enumerable: false,
        configurable: true,
        get: function () {
          return inVal
        },
        set: function (val) {
          inVal = val
          updateContext.call(this)
        }.bind(this)
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
          updateContext.call(this)
        }.bind(this)
      })
    }
    i++
    nextState.call(this, i)
  }
}

var setState = function () {
  nextState.call(this, 0)
}

var stateList = []

var clearState = function () {
  stateList = []
}

var addState = function (state) {
  if (stateList.indexOf(state) === -1) stateList = stateList.concat(state)
}

var genElement = function () {
  this.base = this.__pristineFragment__.cloneNode(true)
  tmplHandler(this, addState)
}

exports.genElement = genElement
exports.addState = addState
exports.setState = setState
exports.clearState = clearState
exports.updateContext = updateContext
