var copy = require('./copy')
var tag = require('./tag')
var tmplHandler = require('./tmplHandler')
var tmplStylesHandler = require('./tmplStylesHandler')
var tmplClassHandler = require('./tmplClassHandler')
var tmplAttrHandler = require('./tmplAttrHandler')
var processEvent = require('./processEvent')
var updateElem = require('./elementUtils').updateElem
var selector = require('./utils').selector

var updateContext = function () {
  var self = this
  Object.keys(this.base).map(function (handlerKey) {
    var id = self.base[handlerKey]['keet-id']
    var ele = selector(id)
    if (!ele && typeof self.base[handlerKey] === 'string') {
      ele = document.getElementById(self.el)
    }
    var newElem
    var args = [].slice.call(arguments)
    newElem = genElement.apply(self, [self.base[handlerKey]].concat(args))
    updateElem(ele, newElem, self.ignoreNodes)
  })
}

var vselect = function(id) {
  return document.querySelector('[keet-v="' + id + '"]')
}

var processTernary = function(ident, node){

  var propToReplace = ident.type === 'propOnly' ? ident.props[0].replace(/{{([^{}]+)}}/g, '$1') : ident.proto
  console.log(propToReplace)
  var t = propToReplace.split('?')
  var condition = t[0]
  var leftHand = t[1].split(':')[0]
  var rightHand = t[1].split(':')[1]

  var current

  if(this[condition]){
    current = leftHand
  } else {
    current = rightHand
  }

  if(node){
    if(ident.type === 'propOnly')
        node.setAttribute(ident.attr, ident.proto.replace(/{{([^{}]+)}}/, current))
    else {
      console.log(current, ident)
      node.setAttribute(current, '')
      node.removeAttribute(ident.currentValue)
    }
  }

  ident.currentValue = current
}

var updateNode = function (value) {
  var self = this
  var indexRef = this.__identStores__.map(function(i){
    return i.state
  }).indexOf(value)
  console.log(value, indexRef)
  if(~indexRef){
    var ident = this.__identStores__[indexRef]
    var node = vselect(ident.id)

    if(ident.type === 'attrOnly'){
      if(ident.isTernary){
        processTernary.apply(self, [ ident, node ])
      } else {
        if(node){
          ident.node.setAttribute(self[value], '')
          ident.node.removeAttribute(ident.currentValue)
        }
        ident.currentValue = self[value]
      }
    } else if(ident.type === 'propOnly'){
      if(ident.isTernary){
        processTernary.apply(this, [ ident, node ])
      } else {
        ident.node.setAttribute(ident.attr, ident.proto.replace(/{{([^{}]+)}}/, this[value]))
      }

    }
  }
}

var nextState = function (i) {
  var self = this
  if (i < this.__stateList__.length) {
    var state = this.__stateList__[i]
    var value = this[state]
    Object.defineProperty(this, state, {
      enumerable: false,
      configurable: true,
      get: function () {
        return value
      },
      set: function (val) {
        value = val
        updateNode.call(self, state)
      }
    })
    i++
    nextState.call(this, i)
  } else {
    //
  }
}

var setState = function () {
  nextState.call(this, 0)
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
    ? tag(child.tag,            // html tag
      tpl || '',                // nodeValue
      cloneChild,               // attributes including classes
      styleTpl                  // styles
    ) : tpl                     // fallback if non exist, render the template as string

  tempDiv.innerHTML = s
  if (child.tag === 'input') {
    if (cloneChild.checked) {
      tempDiv.childNodes[0].checked = true
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
