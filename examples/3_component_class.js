import { Component } from '../'
import Artifact2 from './artifact2'
import Artifact from './artifact'

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
      name: `foo${Math.random()}`,
      d: {
        s: Math.random(),
        r: Math.random()
      }
    }, () => {
      console.log(this.state.d)
    })
  }
  onChange(){
    console.log('app mounted')
  }
  render () {
    let d = this.state.d
    let props = this.props
    return (
      <div>
        <button onClick={this.change}>change</button>
        <h4>{this.state.name}</h4>
        {/*<Artifact2 {...d} {...props} />*/}
        {<Artifact {...d} {...props} />}
      </div>
    )
  }
}
