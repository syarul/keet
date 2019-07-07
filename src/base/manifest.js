export default function (props, context, auto) {
  this.props = props || {}
  this.state = this.state || {}

  this.mergeComponent = component => component

  this.__composite__ = new Promise(function(resolve){
    this.mergeComponent = resolve
  }.bind(this))

  if(context) this.context = context

  auto.call(this)
}
