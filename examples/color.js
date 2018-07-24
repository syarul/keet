import Keet from 'keet'

/**
 * usage on how to swap inline style
*/

class App extends Keet {
  constructor () {
    super()
    this.color = 'red'
  }
  toggle () {
    this.color = this.color === 'red' ? 'blue' : 'red'
  }
}

const app = new App()

const vmodel = {
  header: {
    template: `
      <h1>My Simple Color Toggler</h1>
      <p>Usage on how to swap inline style dynamically</p>
    `
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
