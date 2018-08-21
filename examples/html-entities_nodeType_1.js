import Keet from '../'
import { getId } from '../utils'

class App extends Keet {
  state = 'World'
}

const app = new App()

// NOTE: JSDOM does not support createDocumentFragment skipping this test
const frag = document.createElement('div')
frag.appendChild(document.createTextNode('Hello {{state}}'))

app.mount(frag).link('app')

setTimeout(() => console.assert(getId('app').innerHTML === '<div>Hello World</div>', 'hello test'))
