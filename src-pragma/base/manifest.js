export default function(props, context, auto) {
    this.props = props || {}
    this.state = this.state || {}
    if (context) this.bind(context)
}