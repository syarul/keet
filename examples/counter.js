import Keet from '../rebase'

// console.clear()
// let log = console.log.bind(console)

class App extends Keet {
  constructor() {
    super()
    this.count = 0
  }
  add() {
    this.count++
  }
}

const app = new App

const model = {
  header: {
    tag: 'h1',
    template: 'My Simple Counter'
  },
  counter: {
    tag: 'button',
    'k-click': 'add()',
    template: '{{count}} click'
  }
}

app.mount(model).link('app')

// reel('/app').pipe(sink)