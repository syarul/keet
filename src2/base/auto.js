import { isFunction } from '../utils'
import mount from '../parser/mount'

function _resolve (renderer) {
  return new Promise(resolve =>
    isFunction(renderer) && resolve(renderer)
  )
}

// auto rendered on class constructor instantiation
export default async function () {
  // caller to tell incoming changes

  const r = await _resolve(this.render)

  console.log(this)

  mount.call(
    this,
    r.call(this, this.props, this.state, this.context)
  )
}
