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
    tag: 'div',
    id: 'example',
    style: {
      'font-style': 'italic'
    },
    template: '<h2>hello world</h2>'
  }
}

app.mount(obj).link('app') //'app' is the mount point of our DOM

app.contentUpdate('example', '<h2>hello keet!</h2>')

setTimeout(() => {
  app.setAttr('example', 'style', { 'font-style': 'normal' })
}, 3000)
