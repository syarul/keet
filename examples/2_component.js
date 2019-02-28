import Keet from '../'
import { getId, html } from '../utils'
import Bar from './bar.js'

import Artifact from './artifact'

// console.log(Artifact)

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
  // render () {
  //   let html2 = html.bind(this)
  //   return html2`
  //     <h4>${this.data.name}</h4>
  //     <${Bar} data=${this.data.name}/>
  //   `
  // }
  // render () {
  //   let html2 = html.bind(this)
  //   return html2`
  //     <h4>${this.data.name}</h4>
  //     ${Artifact(this.data.name)}
  //   `
  // }
  render () {
    let html2 = html.bind(this)
    return html2`
      <h4>${this.data.name}</h4>
      <Artifact />
    `(Artifact)
  }
}

window.app = new App()
