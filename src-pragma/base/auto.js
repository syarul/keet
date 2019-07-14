export default function() {
    const { props, state } = this
    this._vnode = this.render(props, state)
    this._resolve()
}