import Keet, { html, CreateModel } from '../'

class App extends Keet {
  constructor () {
    super()
    this.svgModel = new CreateModel()
    this.svgModel.subscribe(model =>
      this.callBatchPoolUpdate()
    )
  }
}

const app = new App()

app.mount(html`
  <ul id="list">
    <!-- {{model:svgModel}} -->
    <li> 
      <svg width="100" height="100">
        <circle cx="50" cy="50" r="{{r}}" stroke="{{stroke}}" stroke-width="4" fill="yellow" />
      </svg>
    </li>
    <!-- {{/model:svgModel}} -->
  </ul>
`).link('app')

app.svgModel.add({ stroke: 'red', r: 5 })

app.svgModel.add({ stroke: 'blue', r: 15 })

app.svgModel.add({ stroke: 'green', r: 25 })
