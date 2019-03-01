
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

/**
 * The main constructor of Keet
 */
export default class Keet {
  constructor (props) {
    manifest.call(this, [], props, auto)
  }

  /**
   * Methods to update data to the virtual DOM template
   * @param {Object} instance - the data to update
   */
  setData () {
    set.apply(this, arguments)
  }

  /**
   * Another component can subscribe to changes on this component.
   * This is the subscribe method
   * @param {Function} fn - the callback function for the subscribe
   */
  subscribe (fn) {
    this.__ref__.exec = this.__ref__.exec.concat(fn)
    return this.__ref__.exec.length - 1
  }

  /**
   * Another component can subscribe to changes on this component.
   * This is the unsubscribe method
   * @param {String} register - the register string identifier
   */
  unsubscribe (register) {
    this.__ref__.exec.splice(register, 1, function () {})
  }

  /**
   * Another component can subscribe to changes on this component.
   * This is the publish method
   * @param {...*} value - one or more parameters to publish to subscribers
   */
  inform () {
    (this.__ref__.exec || []).map(fn => fn.apply(null, arguments))
  }
}
