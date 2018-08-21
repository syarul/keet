import Keet from '../'
import { html, getId } from '../utils'

class App extends Keet {}
const app = new App()

app.mount(html`
  <ul id="list">
    <!-- {{model:task}} -->
    <li>{{taskName}}
      <input type="checkbox" checked="{{complete?checked:''}}"></input>
    </li>
    <!-- {{/model:task}} -->
  </ul>
`).link('app')

setTimeout(() => console.assert(getId('list').innerHTML === '<!-- {{model:task}} --><!-- {{/model:task}} -->', 'model list'))
