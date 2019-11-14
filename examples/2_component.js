import { Component } from '../'
import Artifact from './artifact'

export default class App extends Component {
  state = {
  	name: 'greeting'
  }
  render () {
    let d = {
      s: 1,
      r: 2
    }
    const props = this.props
    const { greet } = this.props
    return (
      <div>
        <h4>{this.state.name} {greet}</h4>
        <Artifact {...d} {...props}/>
      </div>
    )
  }
}
