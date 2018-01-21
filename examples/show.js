import Keet from '../keet'

/**
 * usage on how to swap inline style
*/

class App extends Keet {
  constructor() {
    super()
    this.show = 'inline-flex'
  }
  toggle() {
    this.show = this.show == 'inline-flex' ? 'none' : 'inline-flex'
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
      display: '{{show}}'
    },
    template: 'visible'
  }
}

app.mount(vmodel).link('app')