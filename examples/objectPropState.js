import Keet from '../keet'

class App extends Keet {
  constructor () {
    super()
    this.state = {
      name: 'john',
      age: 31
    }
  }
  change () {
    this.state.name = 'keet'
  }
}

const app = new App()

const vmodel = {
  template: `
    <span>state : {{state.name}}</span>
  `
}

app.mount(vmodel).link('app')

setTimeout(() => {
  app.change()
}, 2000)