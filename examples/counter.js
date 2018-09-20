/* global Event */
import Keet, { html } from '../'
import { getId } from '../utils'

let counter

class App extends Keet {
  el = 'app'
  count = 0

  add (evt) {
    this.count++
  }

  componentDidMount () {
    const click = new Event('click', { bubbles: true, cancelable: true })
    counter = getId('counter')
    counter.dispatchEvent(click)
  }

  componentDidUpdate () {
    console.assert(counter.innerHTML === '1', 'counter test')
  }

  render () {
    return html`
      <button id="counter" k-click="add()">
        {{count}}
      </button>
    `
  }
}

export default new App()
