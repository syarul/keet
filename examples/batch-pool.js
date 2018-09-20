/* global performance */
import Keet, { html } from '../'
import { getId } from '../utils'

let t

class App extends Keet {
  el = 'app'
  data = 0

  updateData (val) {
    this.data = val
  }

  componentDidMount () {
    t = performance.now()

    let count = 10000

    while (count > 0) {
      this.updateData(count)
      count--
    }
  }

  componentDidUpdate () {
    console.log(performance.now() - t)
    console.assert(getId('container').innerHTML === '1', 'batch-pool update')
  }

  render () {
    return html`
      <div id="container">{{data}}</div>
    `
  }
}

export default new App()
