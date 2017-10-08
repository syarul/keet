const app = new Keet('div', {
  template: '{{hello}}',
  hello: {
  	tag: 'span',
  	id:'hello',
  	template: 'hello world',
  	fn:'aw'
  }
})

app.link('app')

console.log(document.querySelector('#hello').attributes)