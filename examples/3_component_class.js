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
  change = () => {
    this.setState({
      name: 'bar',
      d: {
        s: Math.random(),
        r: Math.random()
      }
    }, () => {
      console.log('!')
    })
  }
  onChange(){
    console.log('app mounted')
  }
  render () {
    let props = this.state.d
    return (
      <div>
        <button onClick={this.change}>change</button>
        <h4>{this.state.name}</h4>
        <Artifact {...props} />
      </div>
    )
  }
}
