var tmplHandler = require('./tmplHandler')
var processEvent = require('./processEvent')
var getId = require('../utils').getId
var testEvent = require('../utils').testEvent
var loopChilds = require('../utils').loopChilds
var checkNodeAvailability = require('../utils').checkNodeAvailability
var strInterpreter = require('./strInterpreter')
var componentParse = require('./componentParse')
var modelParse = require('./modelParse')
var nodesVisibility = require('./nodesVisibility')
var morph = require('morphdom')

var updateContext = function () {
  var self = this
  var ele = getId(this.el)
  var newElem = genElement.call(this)
  var frag = []
  // morp as sub-component
  if (this.IS_STUB) {
    morph(ele, newElem.childNodes[0])
  } else {
  // otherwise moph as whole
    newElem.id = this.el
    morph(ele, newElem)
    // clean up document creation from potential memory leaks
    loopChilds(frag, newElem)
    frag.map(function (fragment) {
      fragment.remove()
    })
    // sub-component life-cycle
    this.__componentList__.map(function (component) {
      if(self[component]){
        var c = self[component]
        checkNodeAvailability(c, null, function(){
          if (!c.DID_MOUNT && c.componentDidMount && typeof c.componentDidMount === 'function') {
            c.DID_MOUNT = true
            c.componentDidMount()
          }
        }, function(){
          if (c.DID_MOUNT && c.componentDidUnMount && typeof c.componentDidUnMount === 'function') {
            c.DID_MOUNT = false
            c.componentDidUnMount()
          }
        })
      }
    })
  }
  // exec life-cycle componentDidUpdate
  if (this.componentDidUpdate && typeof this.componentDidUpdate === 'function') {
    this.componentDidUpdate()
  }

  // reset batch pooling
  batchPool.status = 'ready'
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
    }, 100)
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
  if (!~this.__stateList__.indexOf(state)) this.__stateList__ = this.__stateList__.concat(state)
}

var genElement = function (force) {
  var tempDiv = document.createElement('div')
  var tpl = tmplHandler.call(this, updateStateList.bind(this))
  tpl = componentParse.call(this, tpl)
  tpl = modelParse.call(this, tpl)
  tpl = nodesVisibility.call(this, tpl)
  tempDiv.innerHTML = tpl

  setState.call(this)
  testEvent(tpl) && processEvent.call(this, tempDiv)
  if (force) batchPoolExec.call(this)
  return tempDiv
}

exports.genElement = genElement
exports.setState = setState
exports.updateStateList = updateStateList
