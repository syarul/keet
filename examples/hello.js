import Keet from '../keet'

/**
 * start by constructing a class expression as child of "Keet"
 */
class App extends Keet {
  constructor() {
    super()
    this.state = 'World'
  }
}

const app = new App

/**
 * vmodel is a decoupled js object mounted to the constructed "app". For introduction 
 * we declared our vmodel as part of this sample. It's advisable to decouple this elsewhere
 * i.e from (XHR, JSONGraph, streams or dataStore) later on.
 */
const vmodel = {
  header: {
    tag: 'h1',
    template: 'My Simple Vmodel'
  },
  simple: 'Hello {{state}}'
}

app.mount(vmodel).link('app')