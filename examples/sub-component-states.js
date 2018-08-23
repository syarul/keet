import Keet from '../'
import { html, getId } from '../utils'

class Sub extends Keet {
  // provide the node id where this sub will rendered
  el = 'sub'
  state = 'foo'
  change (val) {
    this.state = val
  }
  componentDidUpdate () {
    console.assert(getId('sub').innerHTML === 'this is a sub-component with a state:bar', 'sub-component state')
  }
}

const sub = new Sub()

sub.mount(html`
  <div id="sub">
    this is a sub-component with a state:{{state}}
  </div>
`)

class App extends Keet {
  subc = sub
}

const app = new App()

app.mount(html`
  <div id="container">
    <div>parent</div>
    <!-- {{component:subc}} -->
  </div>
`).link('app')

setTimeout(() => {
  sub.change('bar')
}, 100)
