import Keet from '../'
import { html, createModel as CreateModel, getId } from '../utils'

const ENTER = 13

class App extends Keet {
  task = new CreateModel()
  total = 0
  componentWillMount () {
    this.task.subscribe(model => {
      this.total = model.length
    })
  }
  events (obj, target) {
    if (target.className === 'edit') {
      this.task.update({ ...obj, complete: !obj.complete })
    } else if (target.className === 'destroy') {
      this.task.destroy(obj)
    }
  }
  addTask (e) {
    if (e.which === ENTER && e.target.value !== '') {
      this.task.add({
        taskName: e.target.value,
        complete: false
      })
    }
  }
}

const app = new App()

let name = 'Model Events ({{total}})'

app.mount(html`
  <h2>${name}</h2>
  <p>Add new task with key "Enter"</p>
  <p>Toggle a task state by clicking the button</p>
  <div><input id="taskInput" k-keyup="addTask()" type="text" placeholder="Add a task"></div>
  <ul id="list" k-click="events()">
    <!-- {{model:task}} -->
    <li>
      <button class="edit" style="text-decoration: {{complete?line-through:none}};"> 
        {{taskName}} 
      </button>
      <span class="destroy" style="cursor: pointer;"> [ X ] </span>
    </li>
    <!-- {{/model:task}} -->
  </ul>
`).link('app')

let count = 3

for (let i = 0; i < count; i++) {
  app.task.add({
    taskName: `TASK TODO ${i}`,
    complete: false
  })
}

setTimeout(() => console.assert(getId('list').childNodes.length === 5))
