import Keet from '../keet'

/**
 * usage on how to update state
*/

class App extends Keet {
  constructor() {
    super()
    this.count = 0
    this.plural = ''
  }
  add() {
    this.count++
    if(this.count > 1) this.plural = 's'
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
    'k-click': 'add()',
    template: '{{count}} click{{plural}}'
  }
}

app.mount(vmodel).link('app')