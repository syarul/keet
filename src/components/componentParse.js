import { assert, getId } from '../../utils'

let cacheInit = {}

function getKeetGlobalComponent(component) {
  if (window && typeof window.__keetGlobalComponentRef__ === 'object') {
    let index = window.__keetGlobalComponentRef__.map(c => c.indentifier).indexOf(component)
    if(~index){
      return window.__keetGlobalComponentRef__[index].component
    }
  }
}

export default function (componentStr, node) {
  const component = componentStr.replace('component:', '')
  const c = this[component] || getKeetGlobalComponent(component)
  if (c !== undefined) {
    // this is for initial component runner
    if (!cacheInit[c.ID]) {
      c.render(true)
      cacheInit[c.ID] = c.base.cloneNode(true)
      node.parentNode.replaceChild(c.base, node)
    } else {
      // we need to reattach event listeners if the node is not available on DOM
      if (!getId(c.el)) {
        c.base = c.__pristineFragment__.cloneNode(true)
        c.render(true)
        node.parentNode.replaceChild(c.base, node)
      } else {
        node.parentNode.replaceChild(cacheInit[c.ID].cloneNode(true), node)
        // inform sub-component to update
        c.callBatchPoolUpdate()
      }
    }
  } else {
    assert(false, 'Component ' + component + ' does not exist.')
  }
}
