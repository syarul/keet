import Keet, { html, CreateModel } from '../'

class App extends Keet {
  el = 'app'
  show = true
  nameList = new CreateModel()

  toggle () {
    this.show = !this.show
  }

  render () {
    let persons = [
      { name: 'John', age: 21 },
      { name: 'Sarah', age: 33 }
    ]

    Array.from(persons).map(p => this.nameList.add(p))

    return html`
      <button id="toggle" k-click="toggle()">toggle</button>
      <div id="1">one</div>
      <!-- {{?show}} -->
      <ul id="list">
        <!-- {{model:nameList}} -->
        <li> {{name}} - {{age}} </li>
        <!-- {{/model:nameList}} -->
      </ul>
      <!-- {{/show}} -->
      <div id="3">three</div>
    `
  }
}

export default new App()
