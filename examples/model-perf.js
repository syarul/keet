/* global performance */
import Keet, { CreateModel } from '../'
import { html } from '../utils'

let time
let updateCount = 0
let off
let count = 100
let evtAdd = `model - perf test render ${count} list ({{sAdd}})`
let evtUpdate = `model - perf test update ${count} list ({{sUpdate}})`
let evtDelete = `model - perf test delete ${count} list ({{sDelete}})`
let copyList

class App extends Keet {
  el = 'app'
  task = new CreateModel()
  sAdd = 'wait for dom to render..'
  sUpdate = 'wait for add..'
  sDelete = 'wait for update..'
  length = 0
  componentWillMount () {
    this.task.subscribe(model => {
      this.length = model.length
    })
  }

  action () {
  }

  componentDidMount () {
    setTimeout(() => {
      time = performance.now()
      for (let i = 0; i < count; i++) {
        this.task.add({
          taskName: `todo task ${i}`,
          complete: false
        })
      }
      copyList = JSON.parse(JSON.stringify(this.task.list))
    }, 2000)

    setTimeout(() => {
      time = performance.now()
      for (let i = 0; i < count; i++) {
        this.task.update({ ...copyList[i], complete: true })
      }
    }, 4000)

    setTimeout(() => {
      time = performance.now()
      for (let i = 0; i < count; i++) {
        this.task.destroy(copyList[i])
      }
    }, 6000)
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

  render () {
    return html`
      <h4>model length: {{length}}</h4>
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
    `
  }
}

export default new App()
