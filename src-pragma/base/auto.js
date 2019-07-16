export default function() {
    const { props, state } = this
    this._resolve(this.render(props, state))
}