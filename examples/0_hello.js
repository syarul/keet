import { Component } from '../'

export default class App extends Component {
  state = {
  	greeting: 'World',
    color: 'red'
  }
  pop(){
   console.log(this)
  }
  render () {
    return (
      <h1 id="attr" style={{color:'red', 'font-style': 'italic'}}>
        Hello, {this.state.greeting}
        <p onclick={this.pop}>Hi!</p>
        What's up?
      </h1>
    )
  }
}
