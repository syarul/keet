import { isFunction } from 'lodash'
import diff from '../patcher/diff'

let timer = {}

const morpher = function () {
  diff.call(this)

  // exec life-cycle componentDidUpdate
  isFunction(this.componentDidUpdate) && this.componentDidUpdate()
}

const batch = function (fn, delay) {
  const i = this.__ref__.id
  timer[i] = timer[i] || null
  clearTimeout(timer[i])
  timer[i] = setTimeout(fn.bind(this), delay)
}

export {
  batch,
  morpher
}
