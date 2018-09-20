import Keet from '../'

class App extends Keet {
  el = 'app'
  status = false

  render () {
  	return 'Hello {{status?World:Keet}}'
  }
}

const app = new App()
