import Keet from '../'
import { html, getId } from '../utils' //rem

class App extends Keet {
  state = 'World'
  change(val){
  	console.log('up')
  	this.state = val
  }
}

const app = new App()

app.mount(html`
	<p>test</p>
	<p>test1</p>
	Hello {{state}}
	<p>test2</p>
`).link('app')


setTimeout(() => {
  app.change('Keet')
  setTimeout(() => {
	 app.change('Foo')
  }, 1000)
}, 1000)

// console.assert(getId('app').innerHTML === 'Hello World', 'hello test') //rem