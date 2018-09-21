import Keet, { CreateModel } from '../'

class App extends Keet {
  el = 'app'

  constructor () {
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

  render () {
    Array.from(['run', 'jog', 'walk', 'swim', 'roll']).map(taskName => {
      this.task.add({ taskName: taskName })
    })

    return `
      <h1>myModel</h1>
      <ul id="list">
        <!-- {{model:task}} -->
        <li>
          {{taskName}}
        </li>
        <!-- {{/model:task}} -->
      </ul>
    `
  }
}

export default new App()
