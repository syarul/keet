import Keet from '../'
import { getId } from '../utils'

class App extends Keet {
  state = 'no'
  what = 'horrayyy'
  update (val) {
    this.state = val
  }
  another (val) {
    this.what = val
  }
}

const app = new App()

app.mount('I say: {{state}} {{state}} {{state}}!').link('app')

app.mount('I say: {{state}} {{state}} {{state}} {{what}}!')

app.update('horray')

setTimeout(() => {
  console.assert(getId('app').innerHTML === 'I say: horray horray horray horrayyy!', 'multi state')
})
