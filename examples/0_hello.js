import { Component } from '../'

export default class App extends Component {
  state = {
  	greeting: 'World',
    color: 'red'
  }
  pop = () => {
    this.setState({ color: 'blue' })
  }
  render ({}, { color }) {
    return (
      <h1 id="attr" style={{color:color, 'font-style': 'italic'}}>
        Hello, {this.state.greeting}
        <p onClick={this.pop}>Hi!</p>
        What's up?
      </h1>
    )
  }
}
