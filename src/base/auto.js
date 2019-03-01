import { isFunction, delay } from 'lodash'
import mount from '../parser/mountJSX'

function _resolve (t) {
  return new Promise(resolve =>
    delay(resolve.bind(null, t), 0)
  )
}

// auto rendered on class constructor instantiation
export default async function () {
  isFunction(this.componentWillMount) && this.componentWillMount()

  await _resolve({})

  let tmpl = this.render
  isFunction(tmpl) && mount.call(
    this,
    tmpl.call(this)
  )
}
