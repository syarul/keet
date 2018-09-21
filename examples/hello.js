import Keet from '../'
import { getId } from '../utils'

class App extends Keet {
  el = 'app'
  state = 'World'

  componentDidMount () {
    console.assert(getId('app').innerHTML === 'Hello World', 'hello test')
  }

  render () {
    return 'Hello {{state}}'
  }
}

export default new App()
