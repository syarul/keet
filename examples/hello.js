import Keet from '../'
import { getId, html } from '../utils'

class App extends Keet {
  el = 'app'
  data = {
  	greeting: 'World'
  }

  update(){
  	this.setData({
  		greeting: 'Keet'
  	})
  }

  componentDidMount () {
    // console.assert(getId('app').innerHTML === 'Hello World', 'hello test')
  }

  pop(...args){
  	console.log(args)
  }
  ref(){
  	let clr = 'red' 

  	return html`
  	  <span id="test" style="color:${clr}" onclick="${ev => this.pop(ev, this.data.greeting)}">me too!!</span>
  	`
  }

  render () {
    return html`
      Hello ${this.data.greeting} ${this.ref()}`
  }
}

const app = new App()
