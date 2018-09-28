import Keet, { html } from '../'

class App extends Keet {
  el = 'app'
  show = true

  toggle () {
    this.show = !this.show
  }

  render () {
    return html`
      <button id="toggle" k-click="toggle()" attr="{{show?foo:bar}}" style="color: {{show?red:blue}};">toggle</button>
      <div id="1">one</div>
      <!-- {{?show}} -->
      <div id="2">two</div>
      <div id="3">three</div>
      <div id="4">four</div>
      <!-- {{/show}} -->
      <div id="5">five</div>
    `
  }
}

export default new App()
