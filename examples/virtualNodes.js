import Keet from 'keet'


class Two extends Keet {
  el = 'two'
}

const two = new Two

two.mount('hello')

class App extends Keet {

  show = false

  change () {
    this.show = !this.show
  }
}

const app = new App()

app.mount(`
  <div id="one">one</div>
  {{?show}}
  <div id="two">two</div>
  {{/show}}
  <div id="three">three</div>
`).register(two).link('app')


setInterval(() => app.change(), 2000)
