import { Component } from '../'
import Artifact from './artifact2'
import Other from './other2'

export default class App extends Component {
  state = {
  	name: 'foo',
    d: {
      s: Math.random(),
      r: Math.random()
    }
  }
  change(){
    this.setState({
      name: this.state.name ===  'foo' ? 'bar' : 'foo',
      d: Object.assign(this.state.d, { s: 'hello' })
    })
  }
  onChange(){
    console.log('app mounted')
  }
  render () {
    let props = this.state.d
    return (
      <div>
        <button onclick={this.change}>change</button>
        <h4>{this.state.name}</h4>
        <Artifact {...props} />
        <Other change={this.state.name === 'foo'} />
      </div>
    )
  }
}
