import Keet from '../keet'

/**
 * usage on how to update state
*/

class App extends Keet {
  constructor() {
    super()
    this.count = 0 // set our initial state in the constructor
  }
  add() {
    this.count++
  }
}

const app = new App

const vmodel = {
  header: {
    tag: 'h1',
    template: 'My Simple Counter'
  },
  counter: {
    tag: 'button',
    'k-click': 'add()', // eventListener click, assign key properties starting with 'k-<event>'
    template: '{{count}} click'
  }
}

app.mount(vmodel).link('app')