import Keet from 'keet'

class App extends Keet {
  constructor (...args) {
    super()
    this.ch = false
    this.args = args
  }
  change (bool) {
    this.ch = bool
  }
}

const app = new App('checked', 'toss')

const instance = {
  wo: {
    tag: 'input',
    type: 'checkbox',
    id: 'testcheck',
    checked: '{{ch}}'
  }
}
app.mount(instance).link('app')
app.change(true)
