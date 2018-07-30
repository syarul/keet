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
var setState = require('./components/genElement').setState
var processEvent = require('./components/processEvent')
var getId = require('./components/utils').getId
var testEvent = require('./components/utils').testEvent
var assert = require('./components/utils').assert

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
  // Before we begin to parse an instance, do a run-down checks
  // to clean up back-tick string which usually has line spacing.
  if (typeof instance === 'string') {
    instance = instance.trim().replace(/\s+/g, ' ')
  // If instance is an html element (usually using template literals), 
  // convert it back to string.
  } else if(typeof instance === 'object' && instance['nodeType']) {
    instance = instance.outerHTML.toString()
  } else {
    assert(typeof instance === 'string' || typeof instance === 'object', 'Parameter is not a string or a html element.')
  }
  // we store the pristine instance in Component.base
  this.base = instance
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
  if(!id) assert(id, 'No id is given as parameter.')
  this.el = id
  if (this.componentWillMount && typeof this.componentWillMount === 'function') {
    this.componentWillMount()
  }
  this.render()
  return this
}

Keet.prototype.render = function (stub) {
  if (stub) {
    return parseStr.call(this, stub)
  } else {
    // Render this component to the target DOM
    parseStr.call(this)
    // since component already rendered, trigger its life-cycle method
    if (this.componentDidMount && typeof this.componentDidMount === 'function') {
      this.componentDidMount()
    }
    return this
  }
}

Keet.prototype.cluster = function () {
  // Chain method to run external function(s), this basically serve
  // as an initializer for all child components within the instance tree
  var args = [].slice.call(arguments)
  if (args.length > 0) {
    args.map(function (f) {
      if (typeof f === 'function') f()
    })
  }
}

Keet.prototype.stubRender = function (tpl, node) {
  // sub-component rendering
  setState.call(this)
  testEvent(tpl) && processEvent.call(this, node)
}

module.exports = Keet
