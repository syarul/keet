import Keet, { html } from '../'
import { getId } from '../utils'

class App extends Keet {
  el = 'app'

  render () {
  	return html`
	  <div id="container">
	  <!-- {{component:sub}} -->
	  </div>
	`
  }
}

const app = new App()
