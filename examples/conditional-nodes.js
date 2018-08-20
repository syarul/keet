import Keet from '../'
import { html, getId } from '../utils'

class App extends Keet {
  show = false
  toggle () {
    this.show = !this.show
    // l(this.show)
  }
}

const app = new App()

app.mount(html`
  <button id="toggle" k-click="toggle()" attr="{{show?foo:bar}}" style="color: {{show?red:blue}};" {{show?testme:test}}>toggle</button>
  <div id="1">one</div>
  <!-- {{?show}} -->
  <div id="2">two</div>
  <div id="3">three</div>
  <div id="4">four</div>
  <!-- {{/show}} -->
  <div id="5">five</div>
`).link('app')

// console.assert(getId('app').innerHTML === '<button id="toggle" k-click="toggle()">toggle</button><div id="1">one</div><div id="3">three</div>', 'conditional nodes') //rem