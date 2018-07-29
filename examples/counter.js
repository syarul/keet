import Keet from '../'
import { getId } from '../components/utils'

class App extends Keet {

  count = 0

  add () {
    this.count++
  }
}

const app = new App()

app.mount('<button id="counter" k-click="add()">{{count}}</button>').link('app')

const click = new Event('click', {'bubbles': true, 'cancelable': true })

const counter = getId('counter')

counter.dispatchEvent(click)

// dom updates is handled by batch pool, to check it we simply add to setTimeout event
setTimeout(() => console.assert(counter.innerHTML === '1', 'counter test'))

