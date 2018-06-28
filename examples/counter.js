import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.count = 0
  }
  add () {
    this.count++
  }
}

const app = new App()

const vmodel = {
  myCounter: {
    tag: 'button',
    'k-click': 'add()',
    template: '{{count}}'
  }
}

app.mount(vmodel).link('app')
