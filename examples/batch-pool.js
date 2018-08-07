import Keet from '../'
import { html, getId } from '../utils'

let count = 1000000

let c = 0

let time

class App extends Keet {
  data = count + 1
  updateData(val) {
  	// WARNING!!: don't print this to console
    this.data = val
  }
  componentDidUpdate(){
  	c++
    console.log(Date.now() - time)
  }
}

const app = new App()

app.mount(html`
  <div id="container">{{data}}</div>
`).link('app')

time = Date.now()

while (count > 0){
  app.updateData(count)
  count--
}

// setTimeout(() => console.assert(getId('container').innerHTML === '1', 'batch-pool update') )






