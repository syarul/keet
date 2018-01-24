import Keet from '../keet'

class App extends Keet {
  constructor() {
    super()
    this.apply = 'value'
  }
  change(res){
    this.apply = res
  }
}

const app = new App()

const instance = { 'template': 'just a {{apply}}' }
app.mount(instance).link('app')

app.change('another')