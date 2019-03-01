function VtreeRenderer () {
  this.render = function (virtualNode, node) {
    const App = virtualNode.elementName

    const app = new App()

    app.el = node.id

    const reg = app.subscribe(res => {
      node.appendChild(app.vnode)
      app.unsubscribe(reg)
    })
  }
}

export default new VtreeRenderer()
