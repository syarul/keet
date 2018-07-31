import Keet from '../'
import { getId } from '../utils' //rem

class App extends Keet {
  count = 0
  add () {
    this.count++
  }
}

const app = new App()

app.mount('<button id="counter" k-click="add()">{{count}}</button>').link('app')

const click = new Event('click', {'bubbles': true, 'cancelable': true }) //rem
//rem
const counter = getId('counter') //rem
//rem
counter.dispatchEvent(click) //rem
//rem
setTimeout(() => console.assert(counter.innerHTML === '1', 'counter test')) //rem