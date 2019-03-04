
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
export default class Keet {
  constructor (props) {
    manifest.call(this, {}, props, auto)
  }

  /**
   * Methods to update data to the virtual DOM template
   * @param {Object} instance - the data to update
   */
  setData () {
    set.apply(this, arguments)
  }

  /**
   * Recheck all props if anything changed, diffing will occurs.
   */
  batchUpdate () {
    auto.call(this).then(generator.bind(this))
  }
}