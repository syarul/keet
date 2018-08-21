import Keet from '../'
import { getId } from '../utils'

class App extends Keet {
  state = 'no'
  update (val) {
    this.state = val
  }
}

const app = new App()

app.mount('I say: {{state}} {{state}} {{state}}!').link('app')

app.update('horray')

setTimeout(() => {
  console.assert(getId('app').innerHTML === 'I say: horray horray horray!', 'multi state')
})
