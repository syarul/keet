import diff from '../patcher/diff'
import { isFunction } from '../utils'

let timer = {}

const morpher = function (callback) {
  diff.call(this)
  isFunction(callback) && callback.call(this)
}

const batch = function (fn, delay) {
  const i = this.__ref__.id
  timer[i] = timer[i] || null
  clearTimeout(timer[i])
  timer[i] = setTimeout(fn.bind(this), delay)
}

export default function (callback) {
  batch.call(this, morpher.bind(this, callback), 1)
}
