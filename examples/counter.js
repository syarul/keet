import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.count = 0
  }
  add () {
    this.count++
  }
}

const app = new App()

app.mount('<button k-click="add()">{{count}}</button>').link('app')
