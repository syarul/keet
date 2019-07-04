import { uniqueId } from 'lodash'

export default function (exec, props, context, auto) {
  this.props = props || {}
  this.exec = exec
  this.state = this.state || {}
  if(context) this.context = context

  Object.defineProperty(this, 'exec', { enumerable: false, configurable: true })

  auto.call(this)
}
