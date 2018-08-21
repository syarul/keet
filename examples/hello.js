import Keet from '../'
import { getId } from '../utils' // rem

class App extends Keet {
  state = 'World'
}

const app = new App()

app.mount('Hello {{state}}').link('app')

console.assert(getId('app').innerHTML === 'Hello World', 'hello test') // rem
