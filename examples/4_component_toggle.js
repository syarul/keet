import { Component } from '../'
import Other from './other2'
import Artifact from './artifact2'

export default class App extends Component {
  el = 'app'
  state = {
  	name: 'foo'
  }
  change(){
    this.setState({
      name: this.state.name ===  'foo' ? 'bar' : 'foo'
    })
  }
  render () {
    return (
      <div>
        <button onclick={this.change}>change</button>
        <h4>{this.state.name}</h4>
        <Artifact {...this.state}/>
        <Other change={this.state.name === 'foo'} />
      </div>
    )
  }
}
