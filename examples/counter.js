import Keet from '../rebase'

console.clear()
let log = console.log.bind(console)

class App extends Keet {
  constructor() {
    super()
    this.count = 0
    this.randomNum = Math.round(Math.random() * 100)
  }
  add() {
    this.count++
    this.roll()
  }
  roll(){
    this.randomNum = Math.round(Math.random() * 100)
    log(this)
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
  },
  random: {
    tag: 'button',
    template: 'roll:{{randomNum}}'
  }
}

app.mount(model).link('app')

// reel('/app').pipe(sink)