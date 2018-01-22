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

// console.clear()
// window.log = console.log.bind(console)

const next = function(...args) {
  let [ i, ele, els ] = args
  if(i < els.length) {
    ele.appendChild(els[i])
    i++
    next.apply(this, [ i, ele, els ])
  } else {
    if(this.componentDidMount && typeof this.componentDidMount === 'function'){
      this.componentDidMount()
    }
  }
}

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

    let els = parseStr(this, true)
      , i = 0

    next.apply(this, [ i, ele, els ])
    return this
  }
  cluster(...args){
    args.map(f => {
      if(typeof f === 'function') f()
    })
  }
}