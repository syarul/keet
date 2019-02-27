import Keet, { childLike } from '../'
import { getId, html } from '../utils'

@childLike()
class App extends Keet {
  el = 'bar'
  data = {
  	name: 'bar'
  }
  componentDidUpdate(){
    console.log(this)
  }
  change2(){
    console.log(this)
    this.setData({
      name: this.data.name === 'dos' ? 'bar' : 'dos' 
    })
  }
  getContext(){
    return this
  }
  render (props) {
    this.props = this.props || {}
    let html2 = html.bind(this)
    return html2`
      <div id='bar' onclick="${this.change2}">
        <h4>${this.data.name} ${this.props.name}</h4>
      </div>
    `
  }
}

export default new App()
