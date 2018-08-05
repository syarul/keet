import Keet from '../'
import { html, createModel, getId } from '../utils'

let model = new createModel()

let people = [
  {name: 'John', age: 21 },
  {name: 'Sarah', age: 33 }
]

Array.from(people).map(p => model.add(p))

class App extends Keet {
  show = true
  people = model
  toggle () {
    this.show = !this.show
  }
}

const app = new App()

app.mount(html`
  <button id="toggle" k-click="toggle()">toggle</button>
  <div id="1">one</div>
  {{?show}}
  <ul id="list">
    {{model:people}}
    <li> {{name}} - {{age}} </li>
    {{/model:people}}
  </ul>
  {{/show}}
  <div id="3">three</div>
`).link('app')

console.assert(getId('app').innerHTML === '<button id="toggle">toggle</button><div id="1">one</div><ul id="list"><li> John - 21 </li><li> Sarah - 33 </li></ul><div id="3">three</div>', 'conditional nodes') //rem