import Keet, { html, childLike } from '../'
import { getId } from '../utils'

@childLike()
class Sub extends Keet {
  el = 'sub'

  render () {
    return html`
      <div id="sub">
        this is a sub-component
      </div>
    `
  }
}

const sub = new Sub()

class App extends Keet {
  el = 'app'

  componentDidMount () {
    let r = '<div id="sub" data-ignore="">this is a sub-component</div>'

    r = `${r}${r}${r}`

    console.assert(getId('container').innerHTML === r, 'sub-component rendering')
  }

  render () {
    return html`
    <div id="container">
      <!-- {{component:sub}} -->
      <!-- {{component:sub}} -->
      <!-- {{component:sub}} -->
    </div>
  `
  }
}

const app = new App()
