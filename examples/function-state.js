import Keet from '../'

class App extends Keet {
  myState () {
    return 1 + 1
  }
}

const app = new App()

app.mount('Total of: 1 + 1 = {{this.myState}}').link('app')
