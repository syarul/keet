import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.myDynamicState = 'World'
  }
}

const app = new App

app.mount('Hello {{myDynamicState}}').link('app')
