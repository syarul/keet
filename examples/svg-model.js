import Keet, { html, CreateModel } from '../'

class App extends Keet {
  el= 'app'
  svgModel = new CreateModel()

  constructor () {
    super()
    this.svgModel.subscribe(model =>
      this.callBatchPoolUpdate()
    )
  }

  render () {
    this.svgModel.add({ stroke: 'red', r: 5 })

    this.svgModel.add({ stroke: 'blue', r: 15 })

    this.svgModel.add({ stroke: 'green', r: 25 })

    return html`
      <ul id="list">
        <!-- {{model:svgModel}} -->
        <li> 
          <svg width="100" height="100">
            <circle cx="50" cy="50" r="{{r}}" stroke="{{stroke}}" stroke-width="4" fill="yellow" />
          </svg>
        </li>
        <!-- {{/model:svgModel}} -->
      </ul>
    `
  }
}

const app = new App()
