/** 
 * Keetjs v3.0.0 Alpha release: https://github.com/keetjs/keet.js
 * Minimalist view layer for the web
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< Keetjs >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
 *
 * Copyright 2018, Shahrul Nizam Selamat
 * Released under the MIT License.
 */

import { getId } from './components/utils'
import parseStr from './components/parseStr'

window.log = console.log.bind(console)

const next = function(...args) {
  let [ i, ele, els ] = args
  if(i < els.length) {
    ele.appendChild(els[i])
    i++
    next.apply(this, [ i, ele, els ])
  } else {
    // bind proxy to component methods
    Object.getOwnPropertyNames(this.__proto__)
      .filter(fn => fn !== 'constructor')
      .map(fn => this[fn] = this[fn].bind(this.__proxy__))

    // component lifeCycle after mounting
    if(this.componentDidMount && typeof this.componentDidMount === 'function'){
      this.componentDidMount()
    }
  }
}

export default class Keet {
  constructor(...args) {
    this.base = {}
    this.args = args || []
    Object.defineProperty(this, '__proxy__', {
      enumerable: false,
      writable: true
    })
  }
  mount(instance) {
    this.base = instance
    return this
  }
  link(id) {
    this.el = id
    // component lifeCycle before mounting
    if(this.componentWillMount && typeof this.componentWillMount === 'function'){
      this.componentWillMount()
    }
    this.render()
    return this
  }
  render() {
    let ele = getId(this.el)
      , els = parseStr.apply(this, this.args)
      , i = 0
    if (ele) {
      ele.innerHTML = ''
      next.apply(this, [ i, ele, els ])
    }
    return this
  }
  cluster(...args){
    args.map(f => {
      if(typeof f === 'function') f()
    })
  }
}