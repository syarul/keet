import Keet from '../'
import { html, createModel, getId } from '../utils'

class App extends Keet {
  task = new createModel()
}
const app = new App()

app.mount(html`
  <ul id="list">
    {{model:task}}
    <li id="{{id}}">{{taskName}}
      <input type="checkbox" {{complete?checked:''}}></input>
    </li>
  </ul>
`).link('app')