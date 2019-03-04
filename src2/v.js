import { isElement, isFunction } from './utils'

function resolveVnode (component) {
  return new Promise(resolve => {
    const intv = setInterval(() => {
      if (isElement(component.vnode)) {
        clearInterval(intv)
        resolve(component.vnode)
      }
    }, 0)
  })
}

function VtreeRenderer () {
  this.render = async function (virtualNode, node) {
    const App = virtualNode.elementName

    const rootApp = new App()

    node.id ? rootApp.el = node.id : node.setAttribute('k-data', rootApp.__ref__.id)

    const vnode = await resolveVnode(rootApp)

    node.appendChild(vnode)

    // detect changes
    // isFunction(rootApp.onChange) && rootApp.onChange()
  }
}

const v = new VtreeRenderer()

export {
  v as default,
  resolveVnode
}
