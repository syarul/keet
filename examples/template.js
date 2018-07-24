import Keet from '../keet'

class App extends Keet {
  constructor () {
    super()
    this.state = 'World'
  }
  change () {
    this.state = 'Keet'
    console.log('change')
  }
}

const app = new App()

const vmodel = {
  template: `
    <span>{{state}}</span>
    <span>{{state}}</span>
    <span>{{state}}</span>
  `
}

app.mount(vmodel).link('app')

setTimeout(() => {
  app.change()
}, 2000)
