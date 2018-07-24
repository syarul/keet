import Keet from '../keet'

class App extends Keet {
  constructor () {
    super()
    this.state = {
      name: 'john',
      age: 31
    }
    this.another = 'foo'
  }
  change () {
    this.state.name = 'keet'
  }
  changeAge () {
    this.state.age = 12
  }
  anotherState () {
    this.another = 'bar'
  }
}

const app = new App()

const vmodel = {
  template: `
    <span>{{another}}</span>
    <span>state : {{state.name}}</span>
    <span>age : {{state.age}}</span>
  `
}

app.mount(vmodel).link('app')

setTimeout(() => {
  app.change()
}, 2000)

setTimeout(() => {
  // ensure state does not mutate
  app.anotherState()
}, 3000)

setTimeout(() => {
  app.changeAge()
}, 4000)
