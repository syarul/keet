/* global Event */
import Keet, { html, childLike } from '../'
import { getId } from '../utils'

@childLike()
class Sub extends Keet {
  el = 'sub'
  val = 'foo'

  change () {
    this.val = this.val === 'foo' ? 'bar' : 'foo'
  }

  componentDidUpdate () {
    console.assert(getId('sub-button').innerHTML === 'value: bar', 'sub-component event')
  }

  render () {
    return html`
      <div id="sub">
        <button id="sub-button" k-click="change()">value: {{val}}</button>
      </div>
    `
  }
}

const subc = new Sub()

class App extends Keet {
  el = 'app'

  componentDidMount () {
    const change = new Event('click', { 'bubbles': true, 'cancelable': true })

    const button = getId('sub-button')

    button.dispatchEvent(change)
  }

  render () {
    return html`
      <div id="container">
        <p>test</p>
          <!-- {{component:sub}} -->
      </div>
    `
  }
}

const app = new App()
