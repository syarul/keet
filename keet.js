/**
 * Keetjs v4.0.0 Alpha release: https://github.com/keetjs/keet.js
 * Minimali4.0.0ew layer for the web
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2018, Shahrul Nizam Selamat
 * Released under the MIT License.
 */

import parseStr from './src/components/parseStr'
import { updateContext, morpher } from './src/components/genElement'
import { getId, genId, assert } from './utils'
import mount from './src/base/mount'

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
class Keet {

  constructor () {
    this.ID = Keet.indentity
  }

  // generate ID for the component
  static get indentity(){
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

  subscribe (fn) {
    this.exec = fn
  }

  inform (model) {
    this.exec && typeof this.exec === 'function' && this.exec(model)
  }

}

export default Keet
