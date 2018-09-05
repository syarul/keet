
//
// Keetjs v4.1.0 Alpha release: https://github.com/keetjs/keet
// Minimalist view layer for the web
//
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//
// Copyright 2018, Shahrul Nizam Selamat
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
import { genId, assert, html } from './utils'
import CreateModel from './src/base/createModel'
import mount from './src/base/mount'

/**
 *
 * The main constructor of Keet
 * @param {string} name - ***optional*** A name to store in global ref
 */
class Keet {
  constructor (name) {
    this.ID = Keet.indentity
    if (name) {
      this.storeRef(name)
    }
  }

  // generate ID for the component
  static get indentity () {
    return genId()
  }

  /**
   * Mount an instance of html/string template
   * @param {Object|string} instance - the html/string template
   */
  mount (instance) {
    return mount.call(this, instance)
  }

  /**
   * Link to DOM node attribute ```id```
   * @param {string} id - the id of the node
   */
  link (id) {
    if (!id) assert(id, 'No id is given as parameter.')
    this.el = id
    this.render()
    return this
  }

  /**
   * @private
   * Render this component to the DOM
   * @param {Boolean} stub - set as true if this a child component
   */
  render (stub) {
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
    this.exec = fn
  }
  /**
   * Another component can subscribe to changes on this component.
   * This is the publish method
   * @param {...*} value - one or more parameters to publish to subscribers
   */
  inform (...args) {
    this.exec && typeof this.exec === 'function' && this.exec.apply(null, args)
  }

  /**
   * Store referance in the global space, with this the parent component do need
   * to store/assign it as a property while still be able to look for the sub-component
   * to initialize it
   * @param {string} name - Identifier for the component, should be unique to avoid conflict
   */
  storeRef (name) {
    window.__keetGlobalComponentRef__ = window.__keetGlobalComponentRef__ || []
    let isExist = window.__keetGlobalComponentRef__.map(c => c.identifier).indexOf(name)
    if (~isExist) {
      assert(false, `The component name: ${name} already exist in the global pool.`)
    } else {
      window.__keetGlobalComponentRef__ = window.__keetGlobalComponentRef__.concat({
        identifier: name,
        component: this
      })
    }
  }
}

export {
  Keet as default,
  html,
  CreateModel
}
