import Keet from '../keet'

/**
 * usage on how to update states reactively
*/

class App extends Keet {
  constructor() {
    super()
    this.count = 0
    this.randomNum = 25
  }
  add() {
    this.count++
    this.roll()
  }
  roll(){
    this.randomNum = Math.round(Math.random() * 100)
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
    template: '{{count}} click'
  },
  random: {
    tag: 'button',
    template: 'roll:{{randomNum}}'
  }
}

app.mount(vmodel).link('app')