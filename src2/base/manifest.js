import { uniqueId } from '../utils'
import auto from './auto'

export default function (exec, props) {
  this.props = props || {}
  this.state = this.state || {}
  this.__ref__ = {
    // generate id for this component
    // id: uniqueId(),
    // pubsub callback storage
    exec
  }

  Object.defineProperty(this, '__ref__', { enumerable: false, configurable: true })

  auto.call(this)
}
