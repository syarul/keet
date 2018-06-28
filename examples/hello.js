import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.state = 'World'
  }
}

const app = new App()

const vmodel = {
  template: 'Hello {{state}}'
}

app.mount(vmodel).link('app')
