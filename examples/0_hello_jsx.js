import Keet from '../'
import { getId, html } from '../utils'

class App extends Keet {
  el = 'app'
  data = {
  	greeting: 'World',
    color: 'red'
  }
  componentDidMount () {
    // console.assert(getId('app').innerHTML === 'Hello World', 'hello test')
  }
  pop(){
   console.log(this)
  }
  render () {
    return (
      <h1 id="attr" style={{color:'red'}}>
        Hello, {this.data.greeting}
        <p onclick={this.pop}>Hi!</p>
        What's up?
      </h1>
    )
  }
}

window.app = new App()
