
//
// Keetjs v4.1.1 Alpha release: https://github.com/keetjs/keet
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
import { genId, assert, html, childLike } from './utils'
import CreateModel from './src/base/createModel'
import mount from './src/base/mount'

/**
 * The main constructor of Keet
 * @param {Boolean} localize - Use local inhertance for sub-components
 * instead using global referance
 */
class Keet {
  constructor (localize) {
    if (localize) {
      this.LOCAL = true
    }
    this.ID = Keet.indentity
    // mount vtree from render arguments
    this.autoRender()
  }

  /**
   * Auto rendered on class constructor instantiation
   */
  async autoRender () {
    await this.el
    if (typeof this.render === 'function') {
      const vtree = this.render()
      this.mount(vtree)
      // ensure parsing only done by root component
      // check constructor if it decorated with childLike
      const proto = Object.getPrototypeOf(this)
      if (this.IS_STUB || (proto && proto.constructor.IS_STUB)) {
        return
      }
      this.cycleVirtualDomTree()
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
    if (!this.LOCAL) {
      if (this.el) {
        this.storeRef(this.el)
      } else {
        assert(false, `Component has no unique identifier.`)
      }
    }
    return mount.call(this, instance)
  }

  /**
   * @private
   * Parse this component to the DOM
   * @param {Boolean} stub - set as true if this a child component
   */
  cycleVirtualDomTree (stub) {
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
  CreateModel,
  childLike
}
