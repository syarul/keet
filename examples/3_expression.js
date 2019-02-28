import Keet from '../'
import { getId, html } from '../utils'

class App extends Keet {
  el = 'app'
  data = {
  	toggle: false
  }
  switch(){
  	this.setData({
      toggle: !this.data.toggle
    })
  }
  greeting(state){
    return state ? 'World' : 'Keet'
  }
  render () {
    return html`
      <button onclick="${this.switch}">Hello ${this.greeting(this.data.toggle)}</button>`
  }
}

window.app = new App()
