import Keet from '../'
import { html, getId } from '../utils'

class App extends Keet {
  el = 'app'

  componentDidMount () {
    console.assert(getId('list').innerHTML === '<!-- {{model:task}} --><!-- {{/model:task}} -->', 'model list')
  }

  render () {
    return html`
      <ul id="list">
        <!-- {{model:task}} -->
        <li>{{taskName}}
          <input type="checkbox" checked="{{complete?checked:''}}"></input>
        </li>
        <!-- {{/model:task}} -->
      </ul>
    `
  }
}

export default new App()
