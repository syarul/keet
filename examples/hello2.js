import Keet from '../'
import { getId, html } from '../utils'

class App extends Keet {
  el = 'app'
  data = {
  	names: ['John', 'Sarah', 'Leon', 'Rex']
  }

  pop(...args){
  	console.log(args)
  }
  person(data, index){
    let html2 = html.bind(this)
  	return html2`
  	  <li key="${index}" onclick="${ev => this.pop(ev, data)}">${data}</li>
  	`
  }
  renderList(){
    return this.data.names.map(this.person.bind(this)).join('')
  }
  render () {
    return html`
      <h4>People</h4>
      <ul>
        ${this.renderList()}
      </ul
    `
  }
}

const app = new App()
