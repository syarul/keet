import { assign, composite } from './utils'
import factory from './propsFactory'

function pureFunction(fn, KeetRenderer) {

  let prevProps = {}

  this.render = () => {
    const activeProps = assign(prevProps, factory.getProps())
    this._vnode = fn(activeProps)
 }

  this.forceRender = () => {

    composite.call(this)

    this.__composite__.then(KeetRenderer.emit.bind(KeetRenderer, 'event-rendered'))

    this._resolve(this.render())

  }

  // initial rendering
  this.render()

} 

export default pureFunction