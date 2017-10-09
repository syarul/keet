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
  template: '{{foo}}',
  foo: {
  	tag: 'div',
    id: 'me'
  }
}

me = () => {

  const app = new App()

  const obj = {
    template: '{{me}}',
    me: {
      tag: 'div',
      template: 'hello world!'
    }
  }

  app.mount(obj).link('me')
}

app.mount(obj).link('app').cluster(me)




// app.swapClass('foo', false, ['tot', 'test'])