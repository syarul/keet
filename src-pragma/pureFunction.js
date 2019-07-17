import { assign, composite } from './utils'
import factory from './propsFactory'

function pureFunction(fn, KeetRenderer, child) {

  let prevProps = {}

  this.render = () => {
    
    const activeProps = assign(prevProps, factory.getProps())

    const newVnode = fn(activeProps)
    child.splice(0, 1, newVnode)
    console.log(child)
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