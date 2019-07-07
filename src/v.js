import { isElement, isFunction } from 'lodash'

function VTreeRenderer () {

  this.rootApp = null

  this.render = function (virtualNode, node) {

    const App = virtualNode.elementName

    const rootApp = new App()

    rootApp.__composite__.then(app => {

      const { vnode } = app

      // console.log(vnode)

      this.rootApp = app

      if(node.id){
        app.el = node.id
      } else if(node.hasAttribute('class')) {
        app.cl = node.getAttribute('class')
      } else {
        throw new Error('Unable to mount node without id/class attribute')
      }

      // detect changes
      isFunction(app.componentWillMount) && app.componentWillMount()

      node.appendChild(vnode)

    })

  }
}

const v = new VTreeRenderer()

export default v
