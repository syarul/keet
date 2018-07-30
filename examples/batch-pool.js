import Keet from '../'
import { getId } from '../components/utils'
import html from 'nanohtml'

let count = 1000000

let c = 0

class App extends Keet {
  data = count + 1
  update = 0
  updateData(val) {
  	// don't print to console
    this.data = val
  }
  componentDidUpdate(){
  	c++
  	this.update = c
  }
}

const app = new App()

app.mount(html`
  <div>
    <div>number of updates: {{update}}</div>
    <div id="container">{{data}}</div>
  </div>
`).link('app')



while (count > 0){
  app.updateData(count)
  count--
}

setTimeout(() => console.assert(getId('container').innerHTML === '1', 'batch-pool update') )






