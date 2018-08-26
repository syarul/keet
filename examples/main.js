// file main.js
import Keet from '../'

import other from './other'

class Main extends Keet {
  constructor() {
    super()
    this.state = 'main'
    other.subscribe(state => {
      this.state = state
      console.log(this)
    })
  }
}

const main = new Main()