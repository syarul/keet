
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
  constructor (props, context) {
    manifest.call(this, {}, props, context, auto)
  }

  /**
   * Methods to update data to the virtual DOM template
   * @param {Object} instance - the data to update
   * @param {Function} callback - callback function once state applied
   */
  setState () {
    set.apply(this, arguments)
  }

  /**
   * Recheck all props if anything changed, diffing will occurs.
   */
  batchUpdate () {
    auto.call(this).then(generator.bind(this))
  }

  /**
   * Method render
   * @param {object} props    Props (eg: JSX attributes) received from parent element/component
   * @param {object} state    Component's current state
   * @param {object} context  Context object (if a parent component has provided context)
   * @returns VitualNode
   */
  render(){}
}
