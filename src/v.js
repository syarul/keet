import { isElement, isFunction } from 'lodash'

import createElement from 'virtual-dom/create-element'

function VTreeRenderer () {

  this.rootApp = null

  this.render = function (virtualNode, node) {

    const App = virtualNode.elementName

    const rootApp = new App()

    rootApp.__composite__.then(app => {

      const { vtree } = app

      console.log(vtree)

      this.rootApp = app

      if(node.id){
        app.el = node.id
      } else if(node.hasAttribute('class')) {
        app.cl = node.getAttribute('class')
      } else {
        throw new Error('Unable to mount node without id/class attribute')
      }

      const vnode = createElement(vtree)

      // detect changes
      isFunction(app.componentWillMount) && app.componentWillMount()

      node.appendChild(vnode)

    })

  }
}

const v = new VTreeRenderer()

export default v
