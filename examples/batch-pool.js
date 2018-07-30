import Keet from '../'
import { html, getId } from '../utils'

let count = 1000000

let c = 0

class App extends Keet {
  data = count + 1
  updateData(val) {
  	// don't print to console
    this.data = val
  }
  componentDidUpdate(){
  	c++
  }
}

const app = new App()

app.mount(html`
  <div id="container">{{data}}</div>
`).link('app')



while (count > 0){
  app.updateData(count)
  count--
}

setTimeout(() => console.assert(getId('container').innerHTML === '1', 'batch-pool update') )






