import Keet from '../'

class App extends Keet {
  el = 'app'

  componentDidMount () {
    this.isMounted = true
  }

  componentDidUpdate () {
    console.assert(this.isMounted === true, 'link, componentDidMount')
  }

  render () {
    return 'test'
  }
}

export default new App()
