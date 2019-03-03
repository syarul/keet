import { uniqueId } from 'lodash'

export default function (exec, props, auto) {
  this.props = props || {}
  this.__ref__ = {
    // generate id for this component
    id: uniqueId(),
    // pubsub callback storage
    exec
  }

  Object.defineProperty(this, '__ref__', { enumerable: false, configurable: true })

  auto.call(this)
}
