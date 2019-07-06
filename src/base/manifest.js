import { uniqueId } from 'lodash'

export default function (props, context, auto) {
  this.props = props || {}
  this.state = this.state || {}

  this.vRendered = res => res

  this.__composite__ = new Promise(function(resolve, reject){
    this.vRendered = resolve
  }.bind(this))

  if(context) this.context = context

  Object.defineProperty(this, 'exec', { enumerable: false, configurable: true })

  auto.call(this)
}
