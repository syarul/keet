import Keet from '../'
import { html, getId } from '../utils'

let count = 1000000

class App extends Keet {
  data = count
  updateData (val) {
    // WARNING!!: don't print this to console
    this.data = val
  }
  componentDidUpdate () {
    console.assert(getId('container').innerHTML === '1', 'batch-pool update')
  }
}

const app = new App()

app.mount(html`
  <div id="container">{{data}}</div>
`).link('app')

setTimeout(() => {
  while (count > 0) {
    app.updateData(count)
    count--
  }
})
