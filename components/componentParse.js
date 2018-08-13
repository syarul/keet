import { assert, getId } from '../utils'

let cacheInit = {}

export default function (componentStr, node) {
  const component = componentStr.replace('component:', '')
  const c = this[component]

  if (c !== undefined) {
    // this is for initial component runner
    if (!cacheInit[c.ID]) {
      c.render.call(c, true)
      cacheInit[c.ID] = c.base.cloneNode(true)
      node.parentNode.replaceChild(c.base, node)
    } else {
      // we need to reattach event listeners if the node is not available on DOM
      if (!getId(this[component].el)) {
        c.base = c.__pristineFragment__.cloneNode(true)
        c.render.call(c, true)
        node.parentNode.replaceChild(c.base, node)
      } else {
        node.parentNode.replaceChild(cacheInit[c.ID].cloneNode(true), node)
      }
    }
    // inform sub-component to update
    c.callBatchPoolUpdate()
  } else {
    assert(false, 'Component ' + component + ' does not exist.')
  }
}
