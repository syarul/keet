import Keet, { createModel as CreateModel } from '../'
import { html, getId } from '../utils'

let task = new CreateModel()

class App extends Keet {
  constructor() {
    super()
    this.task = new CreateModel()
    // subscribe to model changes
    this.task.subscribe(model => {
      // callBatchPoolUpdate - custom method to force update component states.
      // If the component has predefine state(s) that get reassigned within this
      // closure we can safely ignore calling this method.
      this.callBatchPoolUpdate()
    })
  }
}

const app = new App()

app.mount(`
  <h1>myModel</h1>
  <ul id="list">
    <!-- {{model:task}} -->
    <li>
      {{taskName}}
    </li>
    <!-- {{/model:task}} -->
  </ul>`).link('app')

Array.from(['run', 'jog', 'walk', 'swim', 'roll']).map(taskName => {
  app.task.add({ taskName: taskName })
})
