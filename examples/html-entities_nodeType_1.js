import Keet from '../'
import { getId } from '../utils'

class App extends Keet {
  el = 'app'
  state = 'World'

  componentDidMount () {
    console.assert(getId('app').innerHTML === '<div>Hello World</div>', 'hello test')
  }

  render () {
    // NOTE: JSDOM does not support createDocumentFragment skipping this test
    const frag = document.createElement('div')
    frag.appendChild(document.createTextNode('Hello {{state}}'))
    return frag
  }
}

export default new App()
