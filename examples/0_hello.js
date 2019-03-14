import { Component } from '../'

export default class App extends Component {
  state = {
  	greeting: 'World',
    color: 'red'
  }
  pop(){
    this.setState({
      greeting: this.state.greeting === 'World' ? 'Keet' : 'World'
    })
  }
  render ({}, {greeting}) {
    return (
      <div id="attr" style={{color:'red', 'font-size': '2em'}}>
        <p>Hello, {greeting}</p>
        <button onclick={this.pop}>Hi!</button>
        <p>What's up?</p>
      </div>
    )
  }
}
