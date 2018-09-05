import Keet from '../'
import { html } from '../utils'

class App extends Keet {
  width = 100
  rad = 20
  change (r) {
    this.rad = r
  }
}

const app = new App()

app.mount(html`
  <svg width="{{width}}" height="100">
    <circle cx="50" cy="50" r="{{rad}}" stroke="green" stroke-width="4" fill="yellow" />
  </svg>
`).link('app')

setTimeout(() =>
  app.change(30)
  , 1000)

setTimeout(() =>
  app.change(40)
  , 2000)

setTimeout(() =>
  app.change(10)
  , 3000)
