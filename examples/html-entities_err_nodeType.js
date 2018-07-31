import Keet from '../'

class App extends Keet {}

const app = new App()

app.mount({
  nodeType: 2
}).link('app')
