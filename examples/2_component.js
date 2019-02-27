import Keet from '../'
import { getId, html } from '../utils'
import Bar from './bar.js'

// function close(arg){
//   console.log(arg)
//   let ctx = arg.getContext()
//   arg.render.call(ctx)
// }

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
    let html2 = html.bind(this)
    return html2`
      <h4>${this.data.name}</h4>
      <${Bar} data=${this.data.name}/>
    `
  }
}

window.app = new App()
