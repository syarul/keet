var copy = require('./copy')
var tag = require('./tag')
var tmplHandler = require('./tmplHandler')
var tmplStylesHandler = require('./tmplStylesHandler')
var tmplClassHandler = require('./tmplClassHandler')
var tmplAttrHandler = require('./tmplAttrHandler')
var processEvent = require('./processEvent')
var selector = require('./utils').selector
var strInterpreter = require('./strInterpreter')
var nodesVisibility = require('./nodesVisibility')
var sum = require('hash-sum')
var setDOM = require('set-dom')

var updateContext = function () {
  var self = this
  var ele
  var newElem
  var args = [].slice.call(arguments)
  if (typeof this.base === 'object') {
    Object.keys(this.base).map(function (handlerKey) {
      var id = self.base[handlerKey]['keet-id']
      ele = selector(id)
      if (!ele && typeof self.base[handlerKey] === 'string') {
        ele = document.getElementById(self.el)
      }
      newElem = genElement.apply(self, [self.base[handlerKey]].concat(args))
      if (self.base.hasOwnProperty('template')) {
        newElem.id = self.el
      }
      setDOM(ele, newElem)
    })
  } else {
    ele = document.getElementById(self.el)
    if (ele) {
      newElem = genElement.apply(self, [self.base].concat(args))
      newElem.id = self.el
      setDOM(ele, newElem)
    }
  }
}

var nextState = function (i, args) {
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
          updateContext.apply(self, args)
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
          updateContext.apply(self, args)
        }
      })
    }
    i++
    nextState.apply(this, [ i, args ])
  } else {
    //
  }
}

var setState = function (args) {
  nextState.apply(this, [ 0, args ])
}

var updateStateList = function (state) {
  this.__stateList__ = this.__stateList__.concat(state)
}

var genElement = function () {
  var child = [].shift.call(arguments)
  var args = [].slice.call(arguments)

  var tempDiv = document.createElement('div')
  var cloneChild = copy(child)
  delete cloneChild.template
  delete cloneChild.tag
  delete cloneChild.style
  delete cloneChild.class
  // process template if has handlebars value
  this.__stateList__ = []

  var tpl = child.template
    ? tmplHandler.call(this, child.template, updateStateList.bind(this))
    : typeof child === 'string' ? tmplHandler.call(this, child, updateStateList.bind(this)) : null
  // process styles if has handlebars value
  var styleTpl = tmplStylesHandler.call(this, child.style, updateStateList.bind(this))
  // process classes if has handlebars value
  var classTpl = tmplClassHandler.call(this, child, updateStateList.bind(this))
  if (classTpl) cloneChild.class = classTpl
  // custom attributes handler
  if (args && args.length) {
    tmplAttrHandler.apply(this, [ cloneChild ].concat(args))
  }

  var s = child.tag
    ? tag(child.tag, // html tag
      tpl || '', // nodeValue
      cloneChild, // attributes including classes
      styleTpl // inline styles
    ) : tpl // fallback if non exist, render the template as string

  s = nodesVisibility.call(this, s)
  tempDiv.innerHTML = s
  tempDiv.childNodes.forEach(function (c) {
    if (c.nodeType === 1) {
      c.setAttribute('data-checksum', sum(c.outerHTML))
    }
  })
  if (child.tag === 'input') {
    if (cloneChild.checked) {
      tempDiv.childNodes[0].setAttribute('checked', '')
    } else {
      tempDiv.childNodes[0].removeAttribute('checked')
    }
  }

  setState.call(this, args)

  processEvent.call(this, tempDiv)
  return typeof child === 'string'
    ? tempDiv
    : child.tag ? tempDiv.childNodes[0]
      : tempDiv
}

exports.genElement = genElement
exports.setState = setState
exports.updateStateList = updateStateList
