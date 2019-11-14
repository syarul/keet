import { assign } from '../utils'

export default function() {
    const { props, state } = this
    // this._vnode = this.render(props, state)
    const v = this.render(props, state)
    assign(this._vnode, v)
    this._resolve()
}