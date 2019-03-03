import { isFunction } from 'lodash'
import mount from '../parser/mount'

function _resolve (renderer) {
  return new Promise(resolve =>
    isFunction(renderer) && resolve(renderer)
  )
}

// auto rendered on class constructor instantiation
export default async function () {
  // caller to tell incoming changes
  // isFunction(this.willChange) && this.willChange()

  const r = await _resolve(this.render)

  mount.call(
    this,
    r.call(this)
  )
}
