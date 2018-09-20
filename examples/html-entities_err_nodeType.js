import Keet from '../'

class App extends Keet {
  el = 'app'

  render () {
    return {
      nodeType: 2
    }
  }
}

export default new App()
