
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
import mount from './src/base/mount'

/**
 * The main constructor of Keet
 * instead using global referance
 */
class Keet {
  constructor () {
    this.__refEvents__ = []
    this.__refCo__ = {}
    this.ID = Keet.indentity
    // mount template from render arguments
    this.autoRender() // initial rendering which register this as a component
  }

  // Auto rendered on class constructor instantiation
  async autoRender (initial) {
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

  // generate ID for the component
  static get indentity () {
    return genId()
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
   * @param {Boolean} initial - initial or subsequent mounting
   */
  mount (instance, initial) {
    if (!this.el) {
      assert(false, `Component has no unique identifier.`)
    }
    return mount.call(this, instance)
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
   * only trigger diffing when the loop end
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
    this.exec = this.exec || []
    this.exec = this.exec.concat(fn)
  }
  /**
   * Another component can subscribe to changes on this component.
   * This is the publish method
   * @param {...*} value - one or more parameters to publish to subscribers
   */
  inform (...args) {
    if (this.exec.length) {
      this.exec.map(fn => fn.apply(null, args))
    }
  }
}

export {
  Keet as default,
  html,
  childLike
}
