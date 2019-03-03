import { Component } from '../'
import Artifact from './artifact2'

export default class App extends Component {
  el = 'app'
  data = {
  	name: 'foo',
    d: {
      s: Math.random(),
      r: Math.random()
    }
  }
  change(){
    this.setData({
      name: 'bar',
      d: Object.assign(this.data.d, { s: 'hello' })
    })
  }
  onChange(){
    console.log('app mounted')
  }
  render () {
    let props = this.data.d
    return (
      <div>
        <button onclick={this.change}>change</button>
        <h4>{this.data.name}</h4>
        <Artifact {...props} />
      </div>
    )
  }
}
