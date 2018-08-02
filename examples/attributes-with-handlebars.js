import Keet from '../'
import { html, getId } from '../utils'

class App extends Keet {
  text = 'foo'
  condition = false
}

const app = new App()

app.mount(html`
  <div id={{text}} {{condition?foo:bar}}>{{text}}</div>
`).link('app')

console.assert(getId('app').innerHTML === '<div id="foo" bar="">foo</div>', 'attributes with handlebars') //rem