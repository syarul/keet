import { Component } from '../'
import Artifact from './artifact2'

export default class App extends Component {
  el = 'app'
  data = {
  	name: 'foo'
  }
  change(){
    this.setData({
      name: 'bar'
    })
  }
  render () {
    let d = {
      s: 1,
      r: 2
    }
    return (
      <div>
        <h4 {...d} >{this.data.name}</h4>
        <Artifact {...d} />
      </div>
    )
  }
}
