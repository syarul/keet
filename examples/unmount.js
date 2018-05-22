import Keet from 'keet'

const foo = () => {
  class App extends Keet {}

  let app = new App()

  let instance = {
    foo: {
      tag: 'div',
      template: 'foo'
    }
  }
  app.mount(instance).link('foo')

  return app
}

class App extends Keet {
  constructor () {
    super()
    this.swap = 'foo'
  }
  swapchild () {
    this.swap = 'bar'
  }
}

const app = new App()

const instance = {
  foo: {
    tag: 'div',
    template: '<div id="{{swap}}"></div>'
  }
}

app.mount(instance).link('app').cluster(foo)

app.swapchild()
