import Keet from '../'
import { getId, html } from '../utils'

let aff = 'foo'

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

  pop(){
  	console.log(1)
  }
  //console.log(event, ${this.pop}, this)
  ref(){
  	let clr = 'red'
  	// return html`
  	//   <span id="test" style="color:${clr}" k-click="pop()" >me too!!</span>
  	// `
  	// (function(ev) {console.log(ev);})(event)
  	return html`
  	  <span id="test" style="color:${clr}" onclick="ev => console.log(ev)" >me too!!</span>
  	`
  }

  render () {
    return html`
      Hello ${this.data.greeting} ${this.ref()}`
  }
}

const app = new App()


// setTimeout(() => {
//   app.update()
// }, 2000)

// export default new App()
