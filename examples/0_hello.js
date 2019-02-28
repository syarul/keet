import Keet from '../'

class App extends Keet {
  el = 'app'
  data = {
  	greeting: 'World',
    color: 'red'
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

const app = new App()
