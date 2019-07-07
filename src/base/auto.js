import { isFunction } from 'lodash'
import mount from '../parser/mount'

function _resolve (renderer) {
  return new Promise(resolve =>
    resolve(renderer)
  )
}

// auto rendered on class constructor instantiation
export default async function () {
  // caller to tell incoming changes
  isFunction(this.componentWillReceiveProps) && this.componentWillReceiveProps()

  const componentRenderer = await _resolve(this.render)

  const { props, state, context } = this

  const virtualNode = componentRenderer.call(this, props, state, context)

  this.guid = this.guid || virtualNode.guid

  return mount.call(
    this,
    virtualNode
  )

}
