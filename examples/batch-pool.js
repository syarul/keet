import Keet from '../'
import { html, getId } from '../utils'

let count = 100000

let c = 0

class App extends Keet {
  data = count
  updateData(val) {
  	// WARNING!!: don't print this to console
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


setTimeout(() => { 
  while (count > 0){
    app.updateData(count)
    count--
  }

  setTimeout(() => console.assert(getId('container').innerHTML === '1', 'batch-pool update') )
}, 1000)






