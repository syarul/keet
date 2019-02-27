import Keet from '../'
import { getId, html } from '../utils'

class App extends Keet {
  el = 'app'
  data = {
  	names: ['John', 'Sarah', 'Leon', 'Rex']
  }
  pop(ev, checkName){
    this.setData({ 
      names: this.data.names.filter(name => name !== checkName) 
    })
  }
  person(name, index){
    // bind html context (RECOMMENDED)
    // ensure expression reassignment works properly
    // add attributes 'key' to element for indexing
    let html2 = html.bind(this)
  	return html2`
  	  <li key="${index}">
        ${name}
        <span style="cursor:pointer;" onclick="${ev => this.pop(ev, name)}">
          [x]
        </span>
      </li>`
  }
  renderList(){
    return this.data.names.map(this.person.bind(this)).join('')
  }
  render () {
    return html`
      <h4>People</h4>
      <ul>
        ${this.renderList()}
      </ul>
    `
  }
}

window.app = new App()
