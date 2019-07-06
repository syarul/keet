import { isElement, isFunction } from 'lodash'

import createElement from 'virtual-dom/create-element'

function VtreeRenderer () {

  this.rootApp = null

  this.render = function (virtualNode, node) {

    const App = virtualNode.elementName

    const rootApp = new App()

    rootApp.__composite__.then(app => {

      const { vtree } = app

      this.rootApp = app

      if(node.id){
        app.el = node.id
      } else if(node.hasAttribute('class')) {
        app.cl = node.getAttribute('class')
      } else {
        throw new Error('Unable to mount node without id/class attribute')
      }

      const vnode = createElement(vtree)

      node.appendChild(vnode)

      // detect changes
      isFunction(app.componentWillMount) && app.componentWillMount()

    })

  }
}

const v = new VtreeRenderer()

export default v
