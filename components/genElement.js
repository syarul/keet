var tmplHandler = require('./tmplHandler')
var processEvent = require('./processEvent')
var getId = require('../utils').getId
var testEvent = require('../utils').testEvent
var checkNodeAvailability = require('../utils').checkNodeAvailability
var strInterpreter = require('./strInterpreter')
var componentParse = require('./componentParse')
// var modelParse = require('./modelParse')
var nodesVisibility = require('./nodesVisibility')
var morph = require('morphdom')

var updateContext = function (force) {
  var self = this
  var frag = []
  var ele = getId(this.el)
  var node 
  var currentNode
  !force && genElement.call(this)
  var newElem = document.createElement('div')
  // morp as sub-component
  if (this.IS_STUB) {
    morph(ele, newElem.childNodes[0])
  } else {
  // otherwise moph as whole
    newElem.id = this.el
    newElem.appendChild(this.base)
    morph(ele, newElem)
    
    // sub-component life-cycle
    // this.__componentList__.map(function (component) {
    //   if(self[component]){
    //     var c = self[component]
    //     checkNodeAvailability(c, null, function(){
    //       if (!c.DID_MOUNT && c.componentDidMount && typeof c.componentDidMount === 'function') {
    //         c.DID_MOUNT = true
    //         c.componentDidMount()
    //       }
    //     }, function(){
    //       if (c.DID_MOUNT && c.componentDidUnMount && typeof c.componentDidUnMount === 'function') {
    //         c.DID_MOUNT = false
    //         c.componentDidUnMount()
    //       }
    //     })
    //   }
    // })
  }
  // clean up document creation since its not a fragment
  node = newElem.firstChild
  while(node){
    currentNode = node
    node = node.nextSibling
    currentNode.remove()
  }
  // exec life-cycle componentDidUpdate
  if (this.componentDidUpdate && typeof this.componentDidUpdate === 'function') {
    this.componentDidUpdate()
  }
  // console.log(this)
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
var batchPoolExec = function (force) {
  if (batchPool.status === 'pooling') {
    //
  } else {
    var self = this
    batchPool.status = 'pooling'
    // if batchpool is not yet executed or it was idle (after 100ms)
    // direct morph the DOM
    if (!batchPool.ttl) {
      updateContext.call(this, force)
    } else {
    // we wait until pooling is ready before initiating DOM morphing
      clearTimeout(batchPool.ttl)
      batchPool.ttl = setTimeout(function () {
        updateContext.call(self, force)
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
  var state
  var value
  if(i < stateList.length) {

    state = stateList[i]
    value = this[state]

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

var setState = function () {
  nextState.call(this, 0)
}

var stateList = []

var addState = function(state){
  if(stateList.indexOf(state) === -1) stateList = stateList.concat(state)
}

var genElement = function (force) {

  this.base = this.__pristineFragment__.cloneNode(true)
  tmplHandler(this, addState)
  // return
  // var tempDiv = document.createElement('div')
  // tpl = componentParse.call(this, tpl)
  // tpl = modelParse.call(this, tpl)
  // tpl = nodesVisibility.call(this, tpl)
  // tempDiv.innerHTML = tpl

  // setState.call(this)
  // testEvent(tpl) && processEvent.call(this, tempDiv)
  if (force) {
    batchPoolExec.call(this, force)
  }
}

exports.genElement = genElement
exports.addState = addState
exports.setState = setState
