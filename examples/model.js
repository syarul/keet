import Keet from '../'
import { html } from '../utils'

function createModel(){

  let onChanges = []

  function inform () {
    for (let i = onChanges.length; i--;) {
      onChanges[i](model)
    }
  }

  let model = {
    list: []
  }

  model.subscribe = fn => onChanges.push(fn)

  model.add = function(obj) {
    this.list = this.list.concat(obj)
    inform()
  }

  model.update = function(lookupId, updateObj) {
    this.list = this.list.map(obj =>
      obj[lookupId] !== updateObj[lookupId] ? obj : ({ ...obj, ...updateObj})
    )
    inform()
  }
    
  model.destroy = function(id, objId) {
    this.list = this.list.filter(obj => obj[id] !== objId)
    inform()
  }

  return model
}

class App extends Keet {
  Model = createModel()
  componentWillMount(){
    this.Model.subscribe(m => this.callBatchPoolUpdate())
  }
}
const app = new App()

app.mount(html`
  <ul id="list">
    {{model:Model}}
    <li id="{{id}}">{{me}}
      <input type="checkbox" {{complete?checked:''}}></input>
    </li>
    {{/model:Model}}
  </ul>
`).link('app')

let len = 5

for (let i = 0; i < len; i++) {
  app.Model.add({
    id: i,
    me: (Math.random() * 1e17).toString(32).toUpperCase(),
    complete: i % 2 ? true : false
  })
}


// setTimeout(() => {
//   app.add({
//     id: model.length,
//     me: 'test!',
//     checked: false
//   })
// }, 2000)

// setTimeout(() => {
//   app.destroy(1, 'id')
// }, 4000)

// setTimeout(() => {
//   app.update(0, 'id', {
//     me: 'cool',
//     checked: true
//   })
// }, 6000)
