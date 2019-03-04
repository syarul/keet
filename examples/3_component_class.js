import { Component } from '../'
import Artifact from './artifact2'

export default class App extends Component {
  el = 'app'
  state = {
  	name: 'foo',
    d: {
      s: Math.random(),
      r: Math.random()
    }
  }
  change(){
    this.setState({
      name: 'bar',
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
      </div>
    )
  }
}
