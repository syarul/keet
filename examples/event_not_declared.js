/* global Event */
import Keet from '../'
import { getId } from '../utils'

let counter

class App extends Keet {
  el = 'app'
  count = 0

  componentDidUpdate () {
    console.assert(counter.innerHTML === '0', 'counter test')
  }

  componentDidMount () {
    const click = new Event('click', { 'bubbles': true, 'cancelable': true })
    counter = getId('counter')
    counter.dispatchEvent(click)
  }

  render () {
    return '<button id="counter" k-click="add()">{{count}}</button>'
  }
}

export default new App()
