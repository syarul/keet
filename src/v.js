import { isElement, isFunction } from 'lodash'

// function resolveVnode (component) {
//   // console.log(component.vnode)
//   return new Promise(resolve => {
//     console.log(component.vnode)
//     const intv = setInterval(() => {
//       // console.log(component.vnode)
//       if (isElement(component.vnode)) {
//         clearInterval(intv)
//         resolve(component.vnode)
//       }
//     }, 0)
//   })
// }

function VtreeRenderer () {
  this.render = function (virtualNode, node) {

    const App = virtualNode.elementName
    // let tt = new Date()
    
    const _root = new App()

    _root.__composite__.then(app => {

      const { vnode } = app

      // console.log(`tt:${new Date() - tt}`)

      if(node.id){
        app.el = node.id
      } else if(node.hasAttribute('class')) {
        app.cl = node.getAttribute('class')
      } else {
        throw new Error('Unable to mount node without id/class attribute')
      }

      // let t = new Date()

      // console.log(new Date() - t)

      node.appendChild(vnode)

      // detect changes
      isFunction(app.componentWillMount) && app.componentWillMount()

    })

  }
}

const v = new VtreeRenderer()

export {
  v as default,
  // resolveVnode
}
