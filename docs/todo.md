---
id: todo
title: List (advance)
sidebar_label: List (advance)
---

## Todo List

This is a sample list with states and events combine together.

> NOTE: Ensure model has a root node with id

```js
import Keet, { html, CreateModel } from 'keet'

const ENTER = 13

class App extends Keet {
  el = 'app'
  total = 0
  task = new CreateModel()
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
  render() {
    
    this.task.subscribe(model => {
      this.total = model.length
    })
    
    let count = 0
    
    while (count < 3) {
      this.task.add({
        taskName: `TASK TODO ${count}`,
        complete: false
      })
      count++
    }
    
    let name = 'Model Events ({{total}})'

    return html`
```
```html
      <h4>${name}</h4>
      <p>Add new task with key "Enter"</p>
      <p>Toggle a task state by clicking the button</p>
      <p>Remove a task by clicking the [ X ]</p>
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
```
```js
    `
  }
}

const app = new App()
```

## Codepen Sample

<p data-height="265" data-theme-id="dark" data-slug-hash="yxorPq" data-default-tab="js,result" data-user="syarul" data-pen-title="Keetjs - List(advance)" class="codepen">See the Pen <a href="https://codepen.io/syarul/pen/yxorPq/">Keetjs - List(advance)</a> by Shahrul Nizam b. Selamat (<a href="https://codepen.io/syarul">@syarul</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## SVG

A sample list with SVG

> NOTE: Ensure SVG node is place within another node container i.e LI

<p data-height="265" data-theme-id="dark" data-slug-hash="LVMdYa" data-default-tab="js,result" data-user="syarul" data-pen-title="svg hexagon loader with Keet.js" class="codepen">See the Pen <a href="https://codepen.io/syarul/pen/LVMdYa/">svg hexagon loader with Keet.js</a> by Shahrul Nizam b. Selamat (<a href="https://codepen.io/syarul">@syarul</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>