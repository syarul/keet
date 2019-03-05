import { uniqueId } from '../utils'
import auto from './auto'

export default function (exec, props, state, context) {
  this.props = props || {}
  this.state = state || {}
  this.context = context || {}
  this.__ref__ = {
    // generate id for this component
    // id: uniqueId(),
    // pubsub callback storage
    exec
  }

  Object.defineProperty(this, '__ref__', { enumerable: false, configurable: true })

  auto.call(this)
}
