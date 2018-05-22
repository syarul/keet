import Keet from 'keet'

/**
 * usage on how to update state
*/

class App extends Keet {
  constructor () {
    super()
    this.count = 0 // set our initial state in the constructor
  }
  add () {
    this.count++
  }
}

const app = new App()

const vmodel = {
  header: {
    template: `
      <h1>My Simple Counter</h1>
      <p>Usage on how to update states reactively</p>
    `
  },
  counter: {
    tag: 'button',
    /**
     * eventListener click, assign key properties starting
     * with 'k-<event>'
     */
    'k-click': 'add()',
    template: '{{count}}'
  }
}

app.mount(vmodel).link('app')
