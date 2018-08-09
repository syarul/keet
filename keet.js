'use strict'
/**
 * Keetjs v4.0.0 Alpha release: https://github.com/keetjs/keet.js
 * Minimalist view layer for the web
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2018, Shahrul Nizam Selamat
 * Released under the MIT License.
 */

var parseStr = require('./components/parseStr')
var updateContext = require('./components/genElement').updateContext
var clearState = require('./components/genElement').clearState
var getId = require('./utils').getId
var assert = require('./utils').assert

var DOCUMENT_FRAGMENT_TYPE = 11
var DOCUMENT_TEXT_TYPE = 3
var DOCUMENT_ELEMENT_TYPE = 1
// var DOCUMENT_COMMENT_TYPE = 8
// var DOCUMENT_ATTRIBUTE_TYPE = 2

/**
 * @description
 * The main constructor of Keet
 *
 * Basic Usage :-
 *
 *    const App extends Keet {}
 *    const app = new App()
 *    app.mount('hello world').link('app')
 *
 */
function Keet () {}

Keet.prototype.mount = function (instance) {
  var base
  var tempDiv
  var frag = document.createDocumentFragment()
  // Before we begin to parse an instance, do a run-down checks
  // to clean up back-tick string which usually has line spacing.
  if (typeof instance === 'string') {
    base = instance.trim().replace(/\s+/g, ' ')
    tempDiv = document.createElement('div')
    tempDiv.innerHTML = base
    while (tempDiv.firstChild) {
      frag.appendChild(tempDiv.firstChild)
    }
  // If instance is a html element process as html entities
  } else if (typeof instance === 'object' && instance['nodeType']) {
    if (instance['nodeType'] === DOCUMENT_ELEMENT_TYPE) {
      frag.appendChild(instance)
    } else if (instance['nodeType'] === DOCUMENT_FRAGMENT_TYPE) {
      frag = instance
    } else if (instance['nodeType'] === DOCUMENT_TEXT_TYPE) {
      frag.appendChild(instance)
    } else {
      assert(false, 'Unable to parse instance, unknown type.')
    }
  } else {
    assert(false, 'Parameter is not a string or a html element.')
  }
  // we store the pristine instance in __pristineFragment__
  this.__pristineFragment__ = frag.cloneNode(true)
  this.base = frag

  // cleanup states on mount
  clearState()

  return this
}

Keet.prototype.flush = function (instance) {
  // Custom method to clean up the component DOM tree
  // useful if we need to do clean up rerender.
  var el = instance || this.el
  var ele = getId(el)
  if (ele) ele.innerHTML = ''
  return this
}

Keet.prototype.link = function (id) {
  // The target DOM where the rendering will took place.
  // We could also apply life-cycle method before the
  // render happen.
  if (!id) assert(id, 'No id is given as parameter.')
  this.el = id
  // life-cycle method before rendering the component
  if (this.componentWillMount && typeof this.componentWillMount === 'function') {
    this.componentWillMount()
  }
  this.render()
  return this
}

Keet.prototype.render = function (stub) {
  // Render this component to the target DOM
  parseStr.call(this, stub)
  return this
}

Keet.prototype.cluster = function () {
  // Chain method to run external function(s), this basically serve
  // as an initializer for all non attached child components within the instance tree
  var args = [].slice.call(arguments)
  if (args.length > 0) {
    args.map(function (f) {
      if (typeof f === 'function') f()
    })
  }
}

var BATCH_CALL_REQUEST = null

Keet.prototype.callBatchPoolUpdate = function () {
  // force component to update, if any state / non-state
  // value changed DOM diffing will occur
  var self = this
  if(BATCH_CALL_REQUEST){
    clearTimeout(BATCH_CALL_REQUEST)
  } 
  BATCH_CALL_REQUEST = setTimeout(function(){
    updateContext.call(self)
  })
}

var setDOM = require('set-dom')
var genModelTemplate = require('./components/genModelTemplate')
var range
  if(typeof document.createRange === 'function'){
    range = document.createRange()
  }

Keet.prototype.typeUpdate = function (type, model, obj, updateObj) {
  var str = this.__protoModel__[model].str
  var parentNode = this.__protoModel__[model].parentNode
  var m 
  var documentFragment
  var el
  if(type === 'add') {
    m = genModelTemplate(str, obj)
    documentFragment = range.createContextualFragment(m)
    el = getId(parentNode.id)
    if(!el){
      var t = setInterval(function(){
        el = getId(parentNode.id)
        if(el) {
          clearInterval(t)
          el.insertBefore(documentFragment, null)
        }
      })
    }
    el.insertBefore(documentFragment, null)
  } else if (type === 'update'){
    var lookupId = obj
    this[model].list.map(function(m){
      if(m[lookupId] === updateObj[lookupId]){
        el = getId(m[lookupId])
        if(el){
          m = genModelTemplate(str, m)
          documentFragment = range.createContextualFragment(m)
          setDOM(el, documentFragment)
        }
      }
    })
  } else if (type === 'destroy'){
    el = getId(updateObj)
    if(el){
      el.remove()
    }
  }
  // console.timeEnd('x')
  // console.log(str)
  // var m = genModelTemplate(str, modelList[i])
}

module.exports = Keet
