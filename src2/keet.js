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

    if(!node.id) {
      throw new error('Unable to mount to Element without `id` attribute')
    }

    let vnode = await componentConstructorRender(virtualNode)

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
