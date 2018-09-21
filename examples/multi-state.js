import Keet from '../'
import { getId } from '../utils'

class App extends Keet {
  el = 'app'
  state = 'no'

  update (val) {
    this.state = val
  }

  componentDidUpdate () {
    console.assert(getId('app').innerHTML === 'I say: horray horray horray!', 'multi state')
  }

  componentDidMount () {
    this.update('horray')
  }

  render () {
    return 'I say: {{state}} {{state}} {{state}}!'
  }
}

export default new App()
