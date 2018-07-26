import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.state = false
  }
  swap() {
    this.state = !this.state
  }
}

const app = new App()

app.mount(`
  <div id="1">{{state?home:''}}</div>
`).link('app')

// setInterval(() => app.change(), 2000)

setTimeout(() => {
  app.swap()
},1000)
