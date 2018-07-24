import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.myState = 'World'
  }
}

const app = new App()

app.mount('Hello {{myState}}').link('app')
