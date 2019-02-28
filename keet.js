
//
// Keetjs v5.0.0-meta https://github.com/keetjs/keet
// Minimalist view layer for the web
//
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//
// Copyright 2019, Shahrul Nizam Selamat
// Released under the MIT License.
//

/**
 * @module keet
 * @example
 * import Keet from 'keet'
 *
 * class App extends Keet {
 *   contructor() {
 *     super()
 *     // props
 *   }
 *   // new extended method
 *   myMethod(...args){
 *     //
 *   }
 * }
 *
 * const app = new App()
 */

import parseStr from './src/components/parseStr'
import { updateContext, morpher } from './src/components/genElement'
import { genId, assert, html, childLike } from './utils'
import mount from './src/base/mountJSX'
import uuid from 'uuid/v4'

/**
 * The main constructor of Keet
 */
class Keet {
  constructor (props) {

    this.props = props || {}

    this.__ref__ = {
      // generate ID for the component
      ID: uuid(),
      // pubsub callback storage
      exec: []
    }

    Object.defineProperty(this, '__ref__', {
      enumerable: false,
      configurable: true
    })
    
    // initial rendering which register this as a component
    this.autoRender()
  }

  // Auto rendered on class constructor instantiation
  async autoRender () {
    await this.el
    if (typeof this.render === 'function') {
      const template = this.render()
      this.mount(template, true)
      // ensure parsing only done by root component
      // check constructor if it decorated with childLike
      const proto = Object.getPrototypeOf(this)
      if (this.IS_STUB || (proto && proto.constructor.IS_STUB)) {
        return
      }
      this.updateDOMElement()
    }
  }

  /**
   * Methods to update data to the virtual DOM template
   * @param {Object} instance - the data to update
   */
  setData (args) {
    Object.assign(this.data, args)
    if (typeof this.render === 'function') {
      const template = this.render()
      this.mount(template)
      updateContext.call(this, morpher, 1)
    }
  }

  /**
   * Mount an instance of html/string template
   * @param {Object|string} instance - the html/string template
   */
  mount () {
    return mount.apply(this, arguments)
  }

  /**
   * Parse this component to the DOM
   * @param {Boolean} stub - set as true if this a child component
   */
  updateDOMElement (stub) {
    // life-cycle method before rendering the component
    if (this.componentWillMount && typeof this.componentWillMount === 'function') {
      this.componentWillMount()
    }
    // Render this component to the target DOM
    if (stub) {
      this.IS_STUB = true
    }
    parseStr.call(this, stub)
  }

  /**
   * Recheck all states if anything changed, diffing will occurs.
   * this method is ***asynchronous*** and ***trottled***, you can call it from a loop and
   * only triggered on at the of the loop
   */
  callBatchPoolUpdate () {
    updateContext.call(this, morpher, 1)
  }
  /**
   * Another component can subscribe to changes on this component.
   * This is the subscribe method
   * @param {Function} fn - the callback function for the subscribe
   */
  subscribe (fn) {
    this.__ref__.exec = this.__ref__.exec.concat(fn)
  }
  /**
   * Another component can subscribe to changes on this component.
   * This is the publish method
   * @param {...*} value - one or more parameters to publish to subscribers
   */
  inform (...args) {
    if (this.__ref__.exec.length) {
      this.__ref__.exec.map(fn => fn.apply(null, args))
    }
  }
}

export {
  Keet as default,
  html,
  childLike
}
