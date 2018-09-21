import Keet, { html } from '../'

class App extends Keet {
  el = 'app'

  render () {
    return html`
      <div id="container">
      <!-- {{component:sub}} -->
      </div>
    `
  }
}

export default new App()
