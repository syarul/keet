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

    if(node.id){
      app.el = node.id
    } else if(node.hasAttribute('class')) {
      app.class = node.getAttribute('class')
    } else {
      throw new Error('Unable to mount node without id/class attribute.')
    }

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
