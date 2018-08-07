import Keet from '../'
import { html, getId } from '../utils' //rem

class App extends Keet {
  state = 'World'
  bar = 'foo'
  color = 'blue'
  change(val){
  	this.state = val
  }
  replace(val){
  	this.bar = val
  	this.color = 'red'
  }
}

const app = new App()

app.mount(html`
	<div style="color: {{color}};">{{bar}}</div>
	Hello {{state}}
	<div>test</div>
	<div>test</div>
	Hello {{state}}
`).link('app')

setTimeout(() => {
  // app.change('foo')
  // app.change('foo1')
  // app.change('foo2')
  app.change('foo3')
  app.replace('nic')
}, 1000)

// console.assert(getId('app').innerHTML === 'Hello World', 'hello test') //rem