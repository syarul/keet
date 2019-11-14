/**
 * @module KeetComponent
 */

import manifest from './base/manifest'
import auto from './base/auto'
import set from './base/set'
import generator from './base/generator'

/**
 * The main constructor of KeetComponent
 */
export default class KeetComponent {
  constructor (props, context) {
    manifest.call(this, props, context, auto)
  }

  /**
   * Methods to update state to the virtual DOM template
   * @param {Object} instance - the state to update
   * @param {Function} callback - callback function once state applied
   */
  setState (nextState, handler) {
    set.call(this, {}, nextState, handler)
  }

  /**
   * Force rerendering component
   */
  forceRender (nextProps, handler) {
    set.call(this, nextProps, {}, handler)
  }

  /**
   * Method render
   * @param {object} props    Props (eg: JSX attributes) received from parent element/component
   * @param {object} state    Component's current state
   * @param {object} context  Context object passing
   * @returns VirtualNode
   */
  render () {}
}
