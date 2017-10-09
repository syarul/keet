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
  tag: 'span',
  template: 'foo'
}

app.link('app', obj) //'app' is the mount point of our DOM