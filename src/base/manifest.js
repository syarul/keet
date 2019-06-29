import { uniqueId } from 'lodash'

export default function (exec, props, auto) {
  this.props = props || {}
  this.exec = exec

  Object.defineProperty(this, 'exec', { enumerable: false, configurable: true })

  auto.call(this)
}
