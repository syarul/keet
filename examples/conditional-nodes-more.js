import Keet, { html } from '../'

class App extends Keet {
  el = 'app'
  show = true
  show2 = false
  toggle () {
    this.show = !this.show
    this.show2 = !this.show
  }

  render () {
    return html`
      <button id="toggle" k-click="toggle()" attr="{{show?foo:bar}}" style="color: {{show?red:blue}};" {{show?testme:test}}>toggle</button>
      <!-- {{?show}} -->
      <div id="2">test</div>
      <!-- {{/show}} -->
      <!-- {{?show2}} -->
      <div id="5">five</div>
      <!-- {{/show2}} -->
    `
  }
}

export default new App()
