import Keet from '../'
import { getId } from '../utils'

class App extends Keet {
   state = 'World'
}

const app = new App()

app.mount(document.createTextNode('Hello {{state}}')).link('app')

setTimeout(() => console.assert(getId('app').innerHTML === 'Hello World', 'hello test'))


