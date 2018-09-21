import Keet, { html, childLike } from '../'
import { getId } from '../utils'

// add decorator to ensure Keet parsing this as child instead of root component
@childLike()
class Sub extends Keet {
  el = 'sub'
  state = 'foo'

  change (val) {
    this.state = val
  }

  componentDidUpdate () {
    console.assert(getId('sub').innerHTML === 'this is a sub-component with a state:bar', 'sub-component state')
  }

  componentDidMount () {
    this.change('bar')
  }

  render () {
    return html`
      <div id="sub">
        this is a sub-component with a state:{{state}}
      </div>
    `
  }
}

const sub = new Sub()

class App extends Keet {
  el = 'app'

  render () {
    return html`
      <div id="container">
        <div>parent</div>
        <!-- {{component:sub}} -->
      </div>
    `
  }
}

const app = new App()

export {
  sub,
  app as default
}
