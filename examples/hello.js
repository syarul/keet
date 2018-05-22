import Keet from 'keet'

/**
 * start by constructing a class expression as child of "Keet"
 */
class App extends Keet {
  constructor () {
    super()
    this.state = 'World'
  }
}

const app = new App()

/**
 * vmodel is a decoupled js object mounted to the component.
 * we could assign dynamic state to our component, DOM mutation
 * does not override the component state reference which always
 * remain pristine
 */
const vmodel = {
  header: {
    template: `
      <h1>My Simple Vmodel</h1>
      <p>vmodel is a decoupled javascript object mounted to the component</p>
    `
  },
  simple: 'Hello {{state}}'
}

app.mount(vmodel).link('app')
