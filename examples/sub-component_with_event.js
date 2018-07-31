import Keet from '../'
import { getId, html } from '../utils'

class Sub extends Keet {
  // provide the node id where this sub will rendered
  el = 'sub'
  val = 'foo'
  change(val){
  	this.val = this.val === 'foo' ? val : 'foo'
  }
}

const sub = new Sub()

sub.mount(html`
  <div id="sub">
  	<button id="sub-button" k-click="change(bar)">value: {{val}}</button>
  </div>
`)

class App extends Keet {
   subc = sub
}

const app = new App()

app.mount(html`
  <div id="container">
	{{component:subc}}	
  </div>
`).link('app')

const change = new Event('click', {'bubbles': true, 'cancelable': true })

const button = getId('sub-button')

button.dispatchEvent(change)

console.assert(getId('sub-button').innerHTML === 'value: bar', 'sub-component event')






