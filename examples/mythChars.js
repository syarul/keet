import Keet from '../keet'

/**
 * usage on how to handle Array list operation
 * 
*/

class App extends Keet {
  constructor() {
    super()
  }
  logId(event){
  	console.log(event.target.id)
  }
}

const app = new App

const vmodel = {
  template: '<button k-click="logId()" id="{{id}}">{{name}}</button>',
  list: [
  	{ id: 'id0', name: 'Short Dwarf' },
  	{ id: 'id1', name: 'Thin Elf' },
  	{ id: 'id2', name: 'Forest Troll' }
  ]
}

const sink = () => app.mount(vmodel).link('container')

export {
  sink as default,
  app
}