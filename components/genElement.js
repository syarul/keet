var tmplHandler = require('./tmplHandler')
var getId = require('../utils').getId
var strInterpreter = require('./strInterpreter')
var morph = require('morphdom')

var overidde = null

var updateContext = function () {
  var self = this
  // enclose the update event as async ensure bath update
  // ensure only trigger DOM diff once at a time
  if(overidde) clearTimeout(overidde)
  overidde = setTimeout(function(){
    var ele = getId(self.el)
    genElement.call(self)
    var newElem = document.createElement('div')
    newElem.id = self.el
    newElem.appendChild(self.base)
    morph(ele, newElem)
    // exec life-cycle componentDidUpdate
    if (self.componentDidUpdate && typeof self.componentDidUpdate === 'function') {
      self.componentDidUpdate()
    }
    // reset batch pooling
    batchPool.status = 'ready'
  })
}

// batch pool update states to DOM
var batchPool = {
  ttl: 0,
  status: 'ready'
}

// The idea behind this is to reduce morphing the DOM when multiple updates
// hit the deck. If possible we want to pool them before initiating DOM
// morphing, but in the event the update is not fast enough we want to return
// to normal synchronous update.
var batchPoolExec = function () {
  if (batchPool.status === 'pooling') {
    //
  } else {
    var self = this
    batchPool.status = 'pooling'
    // if batchpool is not yet executed or it was idle (after 100ms)
    // direct morph the DOM
    if (!batchPool.ttl) {
      updateContext.call(this)
    } else {
    // we wait until pooling is ready before initiating DOM morphing
      clearTimeout(batchPool.ttl)
      batchPool.ttl = setTimeout(function () {
        updateContext.call(self)
      }, 0)
    }
    // we clear the batch pool if it more then 100ms from
    // last update
    batchPool.ttl = setTimeout(function () {
      batchPool.ttl = 0
    }, 0)
  }
}

var nextState = function (i) {
  var self = this
  var state
  var value
  if(i < stateList.length) {

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

var setState = function () {
  nextState.call(this, 0)
}

var stateList = []

var clearState = function(){
  stateList = []
}

var addState = function(state){
  if(stateList.indexOf(state) === -1) stateList = stateList.concat(state)
}

var genElement = function () {
  this.base = this.__pristineFragment__.cloneNode(true)
  tmplHandler(this, addState)
}

exports.genElement = genElement
exports.addState = addState
exports.setState = setState
exports.clearState = clearState
