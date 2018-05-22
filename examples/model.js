import Keet from 'keet'

class App extends Keet {
  constructor (...args) {
    super()
    this.args = args
  }
}
const app = new App('checked')

let model = []

let len = 5

for (let i = 0; i < len; i++) {
  model = model.concat({
    id: i,
    me: (Math.random() * 1e12).toString(32),
    checked: i % 2 !== 0
  })
}

const instance = {
  template: `
    <li id="{{id}}">{{me}}
      <input type="checkbox" checked="{{checked}}"></input>
    </li>`,
  model: model
}

app.mount(instance).link('app')

setTimeout(() => {
  app.add({
    id: model.length,
    me: 'test!',
    checked: false
  })
}, 2000)

setTimeout(() => {
  app.destroy(1, 'id')
}, 4000)

setTimeout(() => {
  app.update(0, 'id', {
    me: 'cool',
    checked: true
  })
}, 6000)
