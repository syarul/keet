import Keet from '../'

class App extends Keet {
  el = 'app'

  myState () {
    return 1 + 1
  }

  render () {
    return 'Total of: 1 + 1 = {{this.myState}}'
  }
}

export default new App()
