import Keet from '../'
import { getId } from '../utils'

class App extends Keet {}

const app = new App()

app.mount('test').link('app').flush()

console.assert(getId('app').innerHTML === '', 'flush test 1')

class App2 extends Keet {
	el = 'app'
}

const app2 = new App2()

app2.mount('test 2').render()

console.assert(getId('app').innerHTML === 'test 2', 'flush test 2')

app2.flush('other')

console.assert(getId('app').innerHTML === 'test 2', 'flush test 3')

app2.flush('app')

console.assert(getId('app').innerHTML === '', 'flush test 4')
