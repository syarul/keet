import { Component } from '../'
import Artifact from './artifact'

export default class App extends Component {
  el = 'app'
  data = {
  	name: 'foo'
  }
  change(){
    this.setData({
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
        <h4>{this.data.name}</h4>
        <Artifact {...d} />
      </div>
    )
  }
}
