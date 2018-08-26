---
id: todo
title: List (advance)
sidebar_label: List (advance)
---

## Todo List

This is a sample list with states and events combine together.

```js
import Keet, { html, CreateModel } from 'keet'

const ENTER = 13

class App extends Keet {
  constructor() {
    super()
    this.task = new CreateModel()
    this.total = 0
    this.task.subscribe(model => {
      this.total = model.length
    })
  }
  events (obj, target) {
    if (target.className === 'edit') {
      this.task.update(Object.assign(obj, { complete: !obj.complete }))
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
```

```html
  <h4>${name}</h4>
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
  </ul>`
```

```js
).link('app')

let count = 3

for (let i = 0; i < count; i++) {
  app.task.add({
    taskName: `TASK TODO ${i}`,
    complete: false
  })
}
```

## Todo List - rendered

> <div id="todoApp"></div><br/>