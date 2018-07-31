import Keet from '../'
import { html, getId } from '../utils'

class App extends Keet {}
const app = new App()

app.mount(html`
  <ul id="list">
    {{model:task}}
    <li id="{{id}}">{{taskName}}
      <input type="checkbox" {{complete?checked:''}}></input>
    </li>
    {{/model:task}}
  </ul>
`).link('app')


setTimeout(() => console.assert(getId('list').innerHTML === '<li id="{{id}}">{{taskName}}<input type="checkbox"></li>', 'model list'))


