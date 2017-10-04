class App extends Keet {
  constructor() {
    super()
  }

  done() {
    console.log('done rendering')
  }
}

const hello_tmpl = {
  template: '{{hello}}',
  hello: {
    tag: 'i',
    template: 'hello'
  }
}

const hello = () => {
  let h = new App
  h.mount(hello_tmpl).link('tmpl')
}

const world_tmpl = {
  template: '{{world}}',
  world: {
    tag: 'i',
    template: ' world'
  }
}

const world = () => {
  let w = new App
  w.mount(world_tmpl).link('tmpl2')
}

const app_tmpl = {
  template: '{{tmpl}}{{tmpl2}}',
  tmpl: {
    tag: 'span',
    id: 'tmpl'
  },
  tmpl2: {
    tag: 'span',
    id: 'tmpl2'
  }
}

const app = new App

app.mount(app_tmpl).link('app').cluster(hello, world).done()