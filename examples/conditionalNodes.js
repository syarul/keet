import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.show = false
  }
  change () {
    this.show = !this.show
  }
}

const app = new App()

app.mount(`
  <div id="1">one</div>
  {{?show}}
  <div id="2">two</div>
  {{/show}}
  <div id="3">three</div>
`).link('app')

setInterval(() => app.change(), 2000)
