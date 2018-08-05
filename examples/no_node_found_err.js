import Keet from '../'
import { getId } from '../utils'

class App extends Keet {
   state = 'World'
}

const app = new App()

app.mount('Hello {{state}}').link('no-node-found')

console.assert(getId('app').innerHTML === '', 'no node found')


