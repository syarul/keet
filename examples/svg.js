import Keet from '../'
import { html } from '../utils'

class App extends Keet {
  el = 'app'
  width = 100
  rad = 20

  change (r) {
    this.rad = r
  }

  timeout (rad, time) {
    return setTimeout(() => this.change(rad), time)
  }

  componentDidMount () {
    this.timeout(30, 1000)
    this.timeout(40, 2000)
    this.timeout(10, 3000)
  }

  render () {
    return html`
      <svg width="{{width}}" height="100">
        <circle cx="50" cy="50" r="{{rad}}" stroke="green" stroke-width="4" fill="yellow" />
      </svg>
    `
  }
}

const app = new App()
