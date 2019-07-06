import { uniqueId } from 'lodash'

export default function (props, context, auto) {
  this.props = props || {}
  this.state = this.state || {}

  this.isRender = res => res

  this.__composite__ = new Promise(function(resolve){
    this.isRender = resolve
  }.bind(this))

  if(context) this.context = context

  auto.call(this)
}
