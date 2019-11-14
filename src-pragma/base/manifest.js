import { composite } from '../utils'

export default function(props, context, auto) {
    this.props = props || {}
    this.state = this.state || {}
    this._vnode = this._vnode || {}
    if (context) this.bind(context)
    composite.call(this)
}