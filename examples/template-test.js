import Keet from 'keet'

class App extends Keet {
  constructor () {
    super()
    this.do = 'a'
    this.me = 'favor'
  }
}
const app = new App()
const instance = {
  template: '{{do}} {{me}}'
}
app.mount(instance).link('app')
