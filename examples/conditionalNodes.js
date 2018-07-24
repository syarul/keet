import Keet from 'keet'


class App extends Keet {}

    const app = new App()

    const vmodel = {
      foo: {
        tag: 'div',
        id: 'foo',
        template: 'foo'
      },
      bar: {
        tag: 'div',
        id: 'bar',
        template: 'bar'
      }
    }

    app.mount(vmodel).link('app')

    setTimeout(() => {
    delete app.baseProxy.bar
    }, 2000)