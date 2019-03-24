import { Component } from '../'
import Artifact from './artifact2'

export default class App extends Component {
  state = {
  	name: 'foo'
  }
  change(){
    this.setState({
      name: 'ber'
    })
  }
  render () {
    let d = {
      s: 1,
      r: 2
    }
    return (
      <div>
        <h4>{this.state.name}</h4>
        <Artifact {...d} />
      </div>
    )
  }
}
