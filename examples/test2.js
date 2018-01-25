import Keet from 'keet'

class App extends Keet {
  constructor() {
    super()
  }
}

const app = new App()

const instance = {
  template: '<span>{{me}}</span>',
  list: [
    { me: 'foo'},
    { me: 'bar'},
    { me: 'bur'},
    { me: 'dur'}
  ]
}

app.mount(instance).link('app')

// app.list.splice(3, 1, { me: 'boom'}, { me: 'boom2'}, { me: 'boom3'})

// app.list.splice(0, 4, { me: 'boom'})
// app.list.shift()
// app.list.unshift({ me: 'boom'}, { me: 'boom2'}, { me: 'boom3'})
// app.list.pop()
delete app.list[1]

let els = document.querySelectorAll('SPAN')

// console.log(els)