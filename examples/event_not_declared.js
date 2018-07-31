import Keet from '../'
import { getId } from '../utils'

class App extends Keet {
  count = 0
}

const app = new App()

app.mount('<button id="counter" k-click="add()">{{count}}</button>').link('app')

const click = new Event('click', {'bubbles': true, 'cancelable': true })

const counter = getId('counter')

counter.dispatchEvent(click)

setTimeout(() => console.assert(counter.innerHTML === '0', 'counter test'))

