import Keet from '../keet'

class App extends Keet {
  constructor() {
    super()
    this.greeting = 'test'
    this.app = 'App'
  }
  change(res){
  	// log(this)
  	this.app = res
  }
  do(){
  	// log(this)
  	this.greeting = 'do'
  }
}

const app = new App 

const vmodel = {
  banner: {
    tag: 'h3',
    template: 'Login {{app}}'
  },
  content: {
    tag: 'div',
    'k-click': 'do()',
    template: '{{greeting}}'
  }
}

app.mount(vmodel).link('app')
setTimeout(() => {
	app.change('t')
}, 1000)