import Keet from '../'

class App extends Keet {
  status = false
}

const app = new App()

app.mount('Hello {{status?World:Keet}}').link('app')
