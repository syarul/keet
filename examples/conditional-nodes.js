import Keet from '../'
import { html, getId } from '../utils'

class App extends Keet {
  show = false
  value = 'one'
  toggle () {
    this.show = !this.show
    // console.log(this.show)
  }
}

const app = new App()

app.mount(html`
  <button id="toggle" k-click="toggle()">toggle</button>
  <div id="1">{{value}}</div>
  {{?show}}
  <div id="2">two</div>
  {{/show}}
  <div id="3">three</div>
`).link('app')

setTimeout(() => {
  app.show = true
}, 1000)

setTimeout(() => {
  app.show = false
}, 2000)



// console.assert(getId('app').innerHTML === '<button id="toggle">toggle</button><div id="1">one</div><div id="3">three</div>', 'conditional nodes') //rem