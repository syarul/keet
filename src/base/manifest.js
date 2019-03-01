import uuid from 'uuid/v4'

export default function (exec, props, auto) {
  this.props = props || {}
  this.__ref__ = {
    // generate id for this component
    id: uuid(),
    // pubsub callback storage
    exec
  }

  Object.defineProperty(this, '__ref__', { enumerable: false, configurable: true })

  auto.call(this)
}
