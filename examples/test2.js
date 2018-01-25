import Keet from 'keet'

// let log = console.log.bind(console)

class App extends Keet {
  constructor(...args) {
    super()
    this.ch = false
    this.cb = 'foo'
    this.args = args
  }
  clickHandler(evt){
    // log(document.querySelector('#testcheck').checked)
    // assert.equal(app.vdom().childNodes[0].checked, true)
  }
  change(bool){
    this.ch = bool
  }
}

window.app = new App('checked', 'toss')

const instance = {
  wo: {
    tag: 'input',
    type: 'checkbox',
    id: 'testcheck',
    checked: '{{ch}}',
    toss: '{{cb}}',
    'k-click': 'clickHandler()'
  }
}

app.mount(instance).link('app')