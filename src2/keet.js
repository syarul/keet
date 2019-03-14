import { isElement, isFunction } from './utils'
import store from './store'

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

function keet () {
  this.render = async function (virtualNode, node) {

    const App = virtualNode.elementName

    // console.log(virtualNode)

    this.rootApp = new App()

    this.rootApp.__ref__.id = store.gen(App)

    console.log(this)

    node.id ? this.rootApp.el = node.id : node.setAttribute('k-data', this.rootApp.__ref__.id)

    const vnode = await resolveVnode(this.rootApp)

    node.appendChild(vnode)

    // detect changes
    // isFunction(rootApp.onChange) && rootApp.onChange()
  }
  
}

const Keet = new keet()

export {
  Keet as default,
  resolveVnode
}
