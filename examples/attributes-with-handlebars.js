import Keet, { html } from '../'
import { getId } from '../utils'

class App extends Keet {
  el = 'app'
  text = 'foo'
  condition = false

  componentDidUpdate () {
    console.assert(getId('app').innerHTML === '<div id="foo" bar="">foo</div>', 'attributes with handlebars')
  }

  render () {
    return html`
      <div id={{text}} {{condition?foo:bar}}>{{text}}</div>
      `
  }
}

export default new App()
