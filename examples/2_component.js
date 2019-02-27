import Keet from '../'
import { getId, html } from '../utils'
import Bar from './bar.js'

class App extends Keet {
  el = 'app'
  data = {
  	name: 'foo'
  }
  render () {
    return html`
      <h4>${this.data.name}</h4>
      ${Bar.render(this)}
    `
  }
  change(){
    this.setData({
      name: 'ber'
    })
  }
}

window.app = new App()
