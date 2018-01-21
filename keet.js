/** 
 * Keetjs v3.0.0 Alpha release: https://github.com/syarul/keet
 * Minimalist view layer for the web
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2018, Shahrul Nizam Selamat
 * Released under the MIT License.
 */

import { getId } from './components/utils'
import parseStr from './components/parseStr'

module.exports = class Keet {
  constructor(context) {
    this.base = context || {}
  }
  mount(instance) {
    this.base = instance
    return this
  }
  link(id) {
    this.el = id
    this.render()
    return this
  }
  render() {
    let ele = getId(this.el)
    if (ele) ele.innerHTML = ''

    let els = parseStr(this, true),
      i = 0
    while (i < els.length) {
      ele.appendChild(els[i])

      if (i === els.length - 1) {
        document.addEventListener('_loaded', window._loaded && typeof window._loaded === 'function' ? window._loaded(this.el) : null, false)
      }
      i++
    }
    return this
  }
  cluster(...args){
    args.map(f => {
      if(typeof f === 'function') f()
    })
  }
}