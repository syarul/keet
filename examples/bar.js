import Keet, { childLike } from '../'
import { getId, html } from '../utils'

@childLike()
class App extends Keet {
  el = 'bar'
  data = {
  	nameit: 'bar'
  }
  componentDidUpdate(){
    console.log(this)
  }
  change(){
    console.log(this)
    this.setData({
      nameit: 'dos'
    })
  }
  render (props) {
    props = props || {data: {}}
    return html`
      <div id='bar' onclick="${this.change}">
        <h4>${this.data.nameit} ${props.data.name}</h4>
      </div>
    `
  }
}

export default new App()
