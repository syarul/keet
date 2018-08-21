/* global performance */
import Keet from '../'
import { html, CreateModel } from '../utils'

let time
let updateCount = 0
let off
let count = 100
let evtAdd = `model - perf test render ${count} list ({{sAdd}})`
let evtUpdate = `model - perf test update ${count} list ({{sUpdate}})`
let evtDelete = `model - perf test delete ${count} list ({{sDelete}})`
let copyList

class App extends Keet {
  task = new CreateModel()
  sAdd = 'wait for dom to render..'
  sUpdate = 'wait for add..'
  sDelete = 'wait for update..'
  componentWillMount () {
    // callBatchPoolUpdate - custom method to inform changes in the model.
    // If the component has other states that reflect the model value changes
    // we can safely ignore calling this method.
    this.task.subscribe(model =>
      this.callBatchPoolUpdate()
    )
  }
  action () {
  }
  componentDidUpdate () {
    updateCount++

    if (updateCount === 1) {
      off = performance.now() - time
      this.sAdd = `${off}ms`
      this.callBatchPoolUpdate()
    }
    if (updateCount === 3) {
      off = performance.now() - time
      this.sUpdate = `${off}ms`
      this.callBatchPoolUpdate()
    }
    if (updateCount === 5) {
      off = performance.now() - time
      this.sDelete = `${off}ms`
      this.callBatchPoolUpdate()
    }
  }
}

const app = new App()

app.mount(html`
  <h4 id="evt-add">${evtAdd}</h4>
  <h4 id="evt-up">${evtUpdate}</h4>
  <h4 id="evt-up">${evtDelete}</h4>
  <ul id="list" k-click="action()">
    <!-- {{model:task}} -->
    <li id="{{id}}"><span style="text-decoration: {{complete?line-through:none}};">{{taskName}}</span>
      <input type="checkbox" checked="{{complete?checked:''}}">
      <span class="destroy" style="cursor: pointer;"> [ X ] </span>
    </li>
    <!-- {{/model:task}} -->
  </ul>
`).link('app')

setTimeout(() => {
  time = performance.now()
  for (let i = 0; i < count; i++) {
    app.task.add({
      taskName: `todo task ${i}`,
      complete: false
    })
  }
  copyList = JSON.parse(JSON.stringify(app.task.list))
}, 2000)

setTimeout(() => {
  time = performance.now()
  for (let i = 0; i < count; i++) {
    app.task.update({ ...copyList[i], complete: true })
  }
}, 4000)

setTimeout(() => {
  time = performance.now()
  for (let i = 0; i < count; i++) {
    app.task.destroy(copyList[i])
  }
}, 6000)
