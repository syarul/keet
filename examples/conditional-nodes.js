import Keet from '../'
import { html, getId } from '../utils'

class App extends Keet {
  show = false
  toggle () {
    this.show = !this.show
  }
}

const app = new App()

app.mount(html`
  <button k-click="toggle()">toggle</button>
  <div id="1">one</div>
  {{?show}}
  <div id="2">two</div>
  {{/show}}
  <div id="3">three</div>
`).link('app')

console.assert(getId('app').innerHTML === '<button>toggle</button><div id="1">one</div><div id="3">three</div>', 'conditional nodes') //rem