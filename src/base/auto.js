import { isFunction } from 'lodash'
import mount from '../parser/mountJSX'

function _resolve (renderer) {
  return new Promise(resolve =>
    isFunction(renderer) && resolve(renderer)
  )
}

// auto rendered on class constructor instantiation
export default async function () {
  // caller to tell incoming changes
  isFunction(this.willChange) && this.willChange()

  const componentRenderer = await _resolve(this.render)

  const { props, state, context } = this

  mount.call(
    this,
    componentRenderer.call(this, props, state, context)
  )
}
