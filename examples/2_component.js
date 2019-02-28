import Keet from '../'
import Artifact from './artifact'

class App extends Keet {
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

window.app = new App()
