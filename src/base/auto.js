function _resolve(renderer) {
    return new Promise(resolve =>
        resolve(renderer)
    )
}

// auto rendered on class constructor instantiation
export default async function() {
    const componentRenderer = await _resolve(this.render)
    const { props, state, context } = this
    this._resolve(componentRenderer.call(this, props, state, context))
}