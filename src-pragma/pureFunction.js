import { assign, composite } from './utils'

function pureFunction(props, fn, KeetRenderer) {

  let prevProps = {}

  this.render = nextProps => {
    props = nextProps || props
    const activeProps = assign(prevProps, props)
    this._vnode = fn(activeProps)
  }

  this.forceRender = (nextProps, handler) => {

    handler = handler || function() {}

    composite.call(this)

    this.__composite__
      .then(KeetRenderer.emit.bind(KeetRenderer, 'event-rendered'))
      .then(handler)

    this._resolve(this.render(nextProps))

  }

  this._fn = fn

  // initial rendering
  this.render()

} 

export default pureFunction