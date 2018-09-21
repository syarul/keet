// file main.js
import Keet from '../'
import { getId } from '../utils'

import other from './other'

class Main extends Keet {
  el = 'app'
  state = 'main'

  componentDidUpdate () {
    console.assert(getId('app').innerHTML === 'state other', ' publish subscribe')
  }

  componentWillMount () {
    other.subscribe(state => {
      this.state = state
    })
  }

  render () {
    return 'state {{state}}'
  }
}

export default new Main()
