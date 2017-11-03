const log = console.log.bind(console)


var c = {
  template: '{{test}}{{test2}}',
  test: {
    tag: 'div',
    template: 'hello',
    'k-mouseover': 'hoverHandle()',
    'k-mouseout': 'outHandle()'
  }
}

c.hoverHandle = function(evt){
  log('hover')
}

c.outHandle = function(evt){
  log('out')
}

class App extends Keet {
  contructor(){
  }


}

const app = new App

app.mount(c).link('app')