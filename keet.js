
/**
 * Keetjs v4.0.0 Alpha release: https://github.com/keetjs/keet
 * Minimalist view layer for the web
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2018, Shahrul Nizam Selamat
 * Released under the MIT License.
 */

import parseStr from './src/components/parseStr'
import { updateContext, morpher } from './src/components/genElement'
import { genId, assert, html } from './utils'
import createModel from './src/base/createModel'
import mount from './src/base/mount'

// allow debugging using shorthand l and tr
function debugMode() { 
  window.l = console.log.bind(console)
  window.tr = console.trace.bind(console)
}

debugMode()

/**
 * @description
 * The main constructor of Keet
 */
class Keet {
  constructor (name) {
    this.ID = Keet.indentity
    if(name){
      this.storeRef(name)
    }
  }

  // generate ID for the component
  static get indentity () {
    return genId()
  }

  mount (instance) {
    return mount.call(this, instance)
  }

  link (id) {
    // The target DOM where the rendering will took place.
    if (!id) assert(id, 'No id is given as parameter.')
    this.el = id
    this.render()
    return this
  }

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

  callBatchPoolUpdate () {
    // force component to update, if any state / non-state
    // value changed DOM diffing will occur
    updateContext.call(this, morpher, 1)
  }
  // pub-sub of the component, a component can subscribe to changes
  // of another component, this is the subscribe method
  subscribe (fn) {
    this.exec = fn
  }
  // pub-sub of the component, a component can subscribe to changes
  // of another component, this is the publish method
  inform (model) {
    this.exec && typeof this.exec === 'function' && this.exec(model)
  }

  // store in global ref
  storeRef (name){
    window.__keetGlobalComponentRef__ = window.__keetGlobalComponentRef__ || {}
    if(window.__keetGlobalComponentRef__[name]) {
      assert(false, `The component name: ${name} already exist in the global pool.`)
    } else {
      window.__keetGlobalComponentRef__[name] = this
    }
  }
}

export {
  Keet as default,
  html,
  createModel
}
