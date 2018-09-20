import Keet from '../'
import { getId, html } from '../utils'

class App extends Keet {
  el = 'app'
  state = {
    name: 'john',
    age: 31
  }

  another = 'foo'

  change () {
    this.state.name = 'keet'
  }
  changeAge () {
    this.state.age = 12
  }
  anotherState () {
    this.another = 'bar'
  }

  componentDidUpdate () {
    console.assert(getId('app').innerHTML === '<span>bar</span><span> state : keet</span><span> age : 12</span>', 'batch-pool update')
  }

  componentDidMount () {
    this.change()

    // ensure state does not mutate
    this.anotherState()
    this.changeAge()
  }

  render () {
    return html`
      <span>{{another}}</span>
      <span> state : {{state.name}}</span>
      <span> age : {{state.age}}</span>
    `
  }
}

const app = new App()
