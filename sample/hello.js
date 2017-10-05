class App extends Keet {
  constructor() {
    super()
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
    template: 'hello world'
  }
}

app.mount(obj).link('app') //'app' is the mount point of our DOM

var observer = new MutationObserver(mutations =>
  mutations.forEach(mutation => console.log(mutation))
)

const vdom = app.vdom()

var config = {
  attributes: true,
  childList: true,
  characterData: true,
  subtree: true
}

observer.observe(vdom, config)

app.contentUpdate('example', 'hello keet!')