import Keet from '../'
import { getId } from '../components/utils'
import html from 'nanohtml'

class App extends Keet {

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
}

const app = new App()

app.mount(html`
  <div id="container">
    <span>{{another}}</span>
    <span>state : {{state.name}}</span>
    <span>age : {{state.age}}</span>
  </div>
`).link('app')


app.change()
// batch pool has started since

// ensure state does not mutate
app.anotherState()
app.changeAge()

// batch pool has initiated, so we have to check outside of the event loop
setTimeout(() => {
  console.assert(getId('container').innerHTML === '<span>bar</span> <span>state : keet</span> <span>age : 12</span>', 'batch-pool update')
})

