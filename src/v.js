import { isElement, isFunction } from 'lodash'

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

    const app = new App()

    app.el = node.id

    const vnode = await resolveVnode(app)

    node.appendChild(vnode)

    // detect changes
    isFunction(app.componentWillMount) && app.componentWillMount()
  }
}

const v = new VtreeRenderer()

export {
  v as default,
  resolveVnode
}
