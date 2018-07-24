import Keet from 'keet'

class App extends Keet {}

const app = new App()

const vmodel = {
  header: {
    template: `
      <h1>Static vs Dynamic</h1>
      <p>Sample showcase how to add and remove a dynamic child DOM to the component</p>
    `
  },
  toggler: {
    tag: 'button',
    template: 'static'
  }
}

app.mount(vmodel).link('app')

setTimeout(() => {
  app.baseProxy['showcase'] = {
    tag: 'button',
    template: 'dynamic'
  }
}, 2000)

setTimeout(() => {
  delete app.baseProxy.showcase
}, 4000)
