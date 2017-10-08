class App extends Keet {
  constructor() {
    super()
  }

  componentOnUpdate(mutation){
    console.log(mutation.type)
  }

}

const app = new App()

const obj = {
  template: '{{example}}',
  example: {
    tag: 'input',
    checked: false,
    type: 'checkbox'
  }
}

app.mount(obj).link('app')


setTimeout(() => {
  app.setAttr('example', 'checked', true)
}, 3000)
