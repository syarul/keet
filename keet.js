'use strict'
/**
 * Keetjs v3.5.2 Alpha release: https://github.com/keetjs/keet.js
 * Minimalist view layer for the web
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2018, Shahrul Nizam Selamat
 * Released under the MIT License.
 */

var getId = require('./components/utils').getId
var parseStr = require('./components/parseStr')
var setState = require('./components/genElement').setState
var testEvent = require('./components/utils').testEvent
var processEvent = require('./components/processEvent')

/**
 * @description
 * The main constructor of Keet
 *
 * @param {String | arg0[, arg1[, arg2[, ...]]]} arguments - Custom property names
 * i.e using 'checked' for input elements.
 * Usage :-
 *
 *    const App extends Keet {
 *      constructor(...args) {
 *        super()
 *        this.args = args
 *      }
 *    }
 *    const app = new App('checked')
 *
 * for example usage cases see https://github.com/syarul/keet/blob/master/examples/check.js
 */
function Keet () {
  // this is the internal state-management for the components. Personally I never
  // get to like state-management in JavaScript. The idea might sound divine but
  // you'll stuck in very complicated get-to-master this framework/flow cycles
  // where you always write the state in some external store and write long logic
  // to do small stuff and they are very slow. On the other hand, this internal
  // store is relatively simple, has references and the availability of sharing
  // across multiple components in any case.

  // prepare store for states
  Object.defineProperty(this, '__stateList__', {
    enumerable: false,
    writable: true
  })
  // prepare store for models
  Object.defineProperty(this, '__modelList__', {
    enumerable: false,
    writable: true
  })
  // prepare store for components
  Object.defineProperty(this, '__componentList__', {
    enumerable: false,
    writable: true
  })
  // prepare template referrer for components
  Object.defineProperty(this, '__componentStub__', {
    enumerable: false,
    writable: true
  })
}

Keet.prototype.mount = function (instance) {
  // Before we begin to parse an instance, do a run-down checks
  // to clean up back-tick string which usually has line spacing
  if (typeof instance === 'object') {
    Object.keys(instance).map(function (key) {
      if (typeof instance[key] === 'string') {
        instance[key] = instance[key].trim().replace(/\s+/g, ' ')
      } else if (typeof instance[key] === 'object' && typeof instance[key]['template'] === 'string') {
        instance[key]['template'] = instance[key]['template'].trim().replace(/\s+/g, ' ')
      }
    })
  } else if (typeof instance === 'string') {
    instance = instance.trim().replace(/\s+/g, ' ')
  }
  // we store the pristine instance in Component.base
  this.base = instance
  return this
}

Keet.prototype.flush = function (instance) {
  // Custom method to clean up the component DOM tree
  // useful if we need to do clean up rerender.
  var ele = getId(this.el)
  if (ele) ele.innerHTML = ''
  return this
}

Keet.prototype.link = function (id) {
  // The target DOM where the rendering will took place.
  // We could also apply life-cycle method before the
  // render happen.
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

Keet.prototype.stubRender = function (tpl) {
  var el = getId(this.el)
  if (el) {
    setState.call(this)
    testEvent(tpl) && processEvent.call(this, el)
  }
}

module.exports = Keet
