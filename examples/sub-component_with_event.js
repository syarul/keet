/* global Event */
import Keet from '../'
import { getId, html } from '../utils'

class Sub extends Keet {
  // provide the node id where this sub will rendered
  el = 'sub'
  val = 'foo'
  change () {
    this.val = this.val === 'foo' ? 'bar' : 'foo'
  }
}

const sub = new Sub()

sub.mount(html`
  <div id="sub">
    <button id="sub-button" k-click="change()">value: {{val}}</button>
  </div>
`)

class App extends Keet {
  subc = sub
}

const app = new App()

app.mount(html`
  <div id="container">
    <p>test</p>
      <!-- {{component:subc}} -->
  </div>
`).link('app')

const change = new Event('click', { 'bubbles': true, 'cancelable': true })

const button = getId('sub-button')

button.dispatchEvent(change)

setTimeout(() => console.assert(getId('sub-button').innerHTML === 'value: bar', 'sub-component event'))
