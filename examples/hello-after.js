import Keet from '../'
import { html, getId } from '../utils' //rem

class App extends Keet {
  state = 'World'
  change(val){
  	this.state = val
  }
}

const app = new App()

app.mount(html`
	<div>test</div>
	Hello {{state}}
	<div>test</div>
	<div>test</div>
	Hello {{state}}
`).link('app')

// setTimeout(() => 
  // app.change('foo')
// , 1000)

// console.assert(getId('app').innerHTML === 'Hello World', 'hello test') //rem