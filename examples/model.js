import Keet, { createModel as CreateModel } from '../'
import { html, getId } from '../utils'

let task = new CreateModel()

class App extends Keet {
  task = task
  componentWillMount () {
    // callBatchPoolUpdate - custom method to inform changes in the model.
    // If the component has other states that reflect the model value changes
    // we can safely ignore calling this method.
    this.task.subscribe(model =>
      this.callBatchPoolUpdate()
    )
  }
  componentDidUpdate () { // rem
    console.assert(getId('list').childNodes.length === 7) // rem
  } // rem
}

const app = new App()

let name = 'myModel' // rem
// rem
app.mount(html`
  <h1>${name}</h1><!-- // rem -->
  <ul id="list">
    <!-- {{model:task}} -->
    <li id="{{id}}">
      {{taskName}}
      <input type="checkbox" checked="{{complete?checked:null}}">
    </li>
    <!-- {{/model:task}} -->
  </ul>
`).link('app')

let taskName = ['run', 'jog', 'walk', 'swim', 'roll']

for (let i = 0; i < taskName.length; i++) {
  app.task.add({
    id: i,
    taskName: taskName[i],
    complete: i % 2 !== 0
  })
}

// update a task
app.task.update('id', {
  id: 0,
  taskName: 'sleep',
  complete: true
})

// remove a task
app.task.destroy('taskName', 'roll')
