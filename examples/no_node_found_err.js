import Keet from '../'

class App extends Keet {
  state = 'World'
}

const app = new App()

app.mount('Hello {{state}}').link('no-node-found')
