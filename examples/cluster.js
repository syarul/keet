import Keet from '../'

class App extends Keet {}

const app = new App()

let [ a, b ] = [ 0, 0 ]
const fn = [ function () { a = 1 }, function () { b = 2 }, 'not-a-function' ]
app.mount('hello').link('app').cluster(...fn)

console.assert(a + b === 3, 'cluster')

// test empty cluster also
app.cluster()

export {
    a, b
}
