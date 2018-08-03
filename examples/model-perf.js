import Keet from '../'
import { html, createModel, getId } from '../utils'

class App extends Keet {
  task = new createModel()
  sAdd = 'wait for dom to render..'
  sUpdate = 'wait for dom to add..'
  componentWillMount(){
    // callBatchPoolUpdate - custom method to inform changes in the model.
    // If the component has other states that reflect the model value changes
    // we can safely ignore calling this method.
    this.task.subscribe(model => {
      this.callBatchPoolUpdate()
    })
  }
  action(evt){
    // console.log(id)
  }
  componentDidUpdate(){
    if(!this.update){ // we do this so we wont stay inside infinite loop
      this.update = true
      this.sAdd = `${new Date() -time}ms`
      this.callBatchPoolUpdate()
    }
  }
}

const app = new App()

let count = 100

let evt_add = `model - perf test render ${count} list ({{sAdd}})`

let evt_update = `model - perf test update ${count} list ({{sUpdate}})`

app.mount(html`
  <h4 id="evt-add">${evt_add}</h4>
  <h4 id="evt-up">${evt_update}</h4>
  <ul id="list" k-click="action()">
    {{model:task}}
    <li id="{{id}}"><span style="text-decoration: {{complete?line-through:none}};">{{taskName}}</span>
      <input type="checkbox" checked="{{complete?checked:''}}">
      <span class="destroy" style="cursor: pointer;"> ( x ) </span>
    </li>
    {{/model:task}}
  </ul>
`).link('app')

let time = new Date()

setTimeout(() => {
  time = new Date()
  for (let i = 0; i < count; i++) {
    app.task.add({
      id: i,
      taskName: `todo task ${i}`,
      complete: false
    })
  }

  // for (let i = 0; i < count; i++) {
  //   app.task.update( 'id', {
  //     id: i,
  //     taskName: 'completed',
  //     complete: true
  //   })
  // }

  for (let i = 0; i < count; i++) {
    // app.task.destroy( 'id', i)
  }

  // setInterval(() => console.log(Date.now() - window._time))

}, 1000)

// update a task
// app.task.update('id', {
//   id: 0,
//   taskName: 'sleep',
//   complete: true
// })

// remove a task
// app.task.destroy('taskName', 'roll')

// setTimeout(() => console.assert(getId('list').innerHTML === '<li id="0">sleep<input type="checkbox" checked=""></li><li id="1">jog<input type="checkbox" checked=""></li><li id="2">walk<input type="checkbox"></li><li id="3">swim<input type="checkbox" checked=""></li>', 'model list')) //rem