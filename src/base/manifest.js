import { composite } from '../utils'

export default function(props, context, auto) {
    this.props = props || {}
    this.state = this.state || {}
    this._resolve = vnode => vnode
    composite.call(this)
    if (context) this.context = context
    auto.call(this)
}