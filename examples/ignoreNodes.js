import Keet from '../keet'

class App extends Keet {
  constructor () {
    super()
    this.state = 'World'
    this.disabled = true
    this.color = 'red'
    this.bgColor ='blue'
    this.do = true
    this.before = 'huh'
  }
  change () {
    this.do = false
    this.disabled = false
    this.state = 'Keet'
  }
}

const app = new App()

const vmodel = {
  template: `
    <div stated="{{before}}" statev="after {{do?me:you}}" style="color: {{color}};background: {{bgColor}};" {{disabled?foo:bar}}>
      Hello {{state?Keet:World}}
    </div>
    <div id="hey">Hello {{state}}</div>
  `
}

// const vmodel = {
//   template: `
//     <div statev="after {{state}}">
//       foobar
//     </div>
//   `
// }

app.mount(vmodel).link('app')


//Hello <!-- keet-state:1 -->{{state}}<!-- /keet-state -->

setTimeout(() => {
  app.change()
}, 3000)
