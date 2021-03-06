import Keet from '../'
import { getId } from '../utils'

class App extends Keet {
  state = 'World'

  componentDidMount () {
    console.assert(getId('app').innerHTML === 'Hello World', 'hello test')
  }

  render () {
    return 'Hello {{state}}'
  }
}

export default new App()
