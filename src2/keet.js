import { isElement, isFunction } from './utils'
import store from './store'
import { componentConstructorRender } from './parser/construct'

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

    let { component, vnode } = await componentConstructorRender(virtualNode)

    component._el = node

    node.appendChild(vnode)

  }
  
}

let pragma = function () {
  this.id = Math.random()
}

// const k = new pragma()

const Keet = new keet()

export {
  Keet as default,
  resolveVnode,
  pragma
}
