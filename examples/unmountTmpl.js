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
    this.test = 'test!'
  }
  swapchild () {
    this.test = 'test2!'
  }
}

const app = new App()

const instance = {
  foo: {
    tag: 'div',
    id: 'foo'
  }
}

app.mount(instance).link('app').cluster(foo)

app.swapchild()
