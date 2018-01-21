import Keet from '../keet'

/**
 * usage on how to swap inline style
*/

class App extends Keet {
  constructor() {
    super()
    this.color = 'red'
  }
  toggle() {
    this.color = this.color == 'red' ? 'blue' : 'red'
  }
}

const app = new App

const vmodel = {
  header: {
    tag: 'h1',
    template: 'My Simple Toggler'
  },
  toggler: {
    tag: 'button',
    'k-click': 'toggle()',
    template: 'toggle'
  },
  showcase: {
    tag: 'button',
    style: {
      background: '{{color}}'
    },
    template: 'this button color is {{color}}'
  }
}

app.mount(vmodel).link('app')