import Keet, { html, CreateModel } from '../'
import { getId } from '../utils'

class App extends Keet {
  el = 'app'
  color = 'red'
  bold = 'bold'
  task = new CreateModel()

  componentWillMount () {
    this.task.subscribe(model =>
      this.callBatchPoolUpdate()
    )
  }

  componentDidMount () {
    let taskList = JSON.parse(JSON.stringify(this.task.list))
    // update a task
    this.task.update({ ...taskList[0], taskName: 'sleep', complete: true })
    // remove a task
    this.task.destroy(taskList[taskList.length - 1])
  }

  componentDidUpdate () {
    console.assert(getId('list').childNodes.length === 6)
  }

  render () {
    let name = 'myModel'

    let taskName = ['run', 'jog', 'walk', 'swim', 'roll']

    taskName.map((task, i) => {
      this.task.add({
        taskName: task,
        complete: i % 2 !== 0
      })
    })

    return html`
      <h1>${name}</h1>
      <ul id="list" style="color: {{color}}; font-weight: {{bold}};">
        <!-- {{model:task}} -->
        <li>
          {{taskName}}
          <input type="checkbox" checked="{{complete?checked:null}}">
        </li>
        <!-- {{/model:task}} -->
      </ul>
    `
  }
}

export default new App()
