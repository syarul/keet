import Keet from '../'
import { getId } from '../utils' //rem

class App extends Keet {
  state = 'World'
  change(val){
  	console.log('up')
  	this.state = val
  }
}

const app = new App()

app.mount('Hello {{state}}').link('app')


setTimeout(() => {
  app.change('Keet')
}, 1000)

// console.assert(getId('app').innerHTML === 'Hello World', 'hello test') //rem