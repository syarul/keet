
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
 * import { Component } from 'keet'
 *
 * class App extends Component {
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

import manifest from './base/manifest'
import auto from './base/auto'
import set from './base/set'
import generator from './base/generator'

/**
 * The main constructor of Keet
 */
export default class Component {
  constructor (props, state, context) {
    manifest.call(this, {}, props, state, context)
  }

  /**
   * Methods to update data to the virtual DOM template
   * @param {Object} instance - the data to update
   */
  setState () {
    set.apply(this, arguments)
  }

  /**
   * Recheck all props if anything changed, diffing will occurs.
   */
  batchUpdate (callback) {
    auto.call(this).then(generator.bind(this, callback))
  }
}
