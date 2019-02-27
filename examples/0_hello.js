import Keet from '../'
import { getId, html } from '../utils'

class App extends Keet {
  el = 'app'
  data = {
  	greeting: 'World'
  }
  componentDidMount () {
    // console.assert(getId('app').innerHTML === 'Hello World', 'hello test')
  }

  pop(change){
  	this.setData({
      greeting: this.data.greeting !== change ? change : 'World'
    })
  }
  button(){
    let data = 'Keet'
    let html2 = html.bind(this)
  	return html2`
  	  <button onclick="${ev => this.pop(data)}">change</button>
  	`
  }

  render () {
    return html`
      Hello ${this.data.greeting} ${this.button()}`
  }
}

window.app = new App()
