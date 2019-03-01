import { isFunction } from 'lodash'
import mount from '../parser/mountJSX'

function _resolve (renderer) {
  return new Promise(resolve =>
    isFunction(renderer) && resolve(true)
  )
}

// auto rendered on class constructor instantiation
export default async function () {
  isFunction(this.componentWillMount) && this.componentWillMount()

  await _resolve(this.render)

  mount.call(
    this,
    this.render.call(this)
  )
}
