import { uniqueId } from 'lodash'

export default function (exec, props, context, auto) {
  this.props = props || {}
  this.exec = exec
  this.context = context || {}
  this.state = this.state || {} 

  Object.defineProperty(this, 'exec', { enumerable: false, configurable: true })

  auto.call(this)
}
