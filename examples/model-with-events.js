import Keet from '../'
import { html, createModel, getId } from '../utils'

const ENTER = 13

const genId = () => (Math.random()*1*1e17).toString(32)

class App extends Keet {
  task = new createModel()
  total = 0
  componentWillMount(){
    this.task.subscribe(model =>
      this.total = model.length
    )
  }
  events(target, id, evt){
    if(target === 'edit'){
      this.toggle(id, evt.target.getAttribute('complete'))
    } else if(target === 'destroy'){
      this.task.destroy('id', id)
    }
    
  }
  addTask(evt){
    if (evt.which === ENTER && evt.target.value !== ''){
      this.task.add({
        id: genId(),
        taskName: evt.target.value,
        complete: false
      })
    }
  }
  toggle(id, complete){
    this.task.update('id', {
      id: id,
      complete: complete === 'yes' ? false : true
    })
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
    {{model:task}}
    <li id="{{id}}">
      <button class="edit" style="text-decoration: {{complete?line-through:none}};" complete="{{complete?yes:no}}"> 
        {{taskName}} 
      </button>
      <span class="destroy" style="cursor: pointer;"> [ X ] </span>
    </li>
    {{/model:task}}
  </ul>
`).link('app')

let count = 3

for (let i = 0; i < count; i++) {
  app.task.add({
    id: genId(),
    taskName: `TASK TODO ${i}`,
    complete: false
  })
}

// update a task
app.task.update('taskName', {
  taskName: 'TASK TODO 0',
  complete: true
})

// // remove a task
app.task.destroy('taskName', 'TASK TODO 2')

setTimeout(() => console.assert(getId('list').childNodes.length === 2))