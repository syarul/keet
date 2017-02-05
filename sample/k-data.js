// k-data linking, methods to control data directly in component state
const app = new Keet
app.link('app')
  .set({
  	value:'{{who}} {{me}}',
  	'k-data': {
  		who: 'My name is'
  	},
  	'css-display': 'inline-flex'
  })

const me = new Keet
me.register('app').set({
    value: '{{just}} {{my}} {{name}}',
    'k-data': {
    	just: 'Shahrul',
    	my: 'Nizam',
    	name: 'Selamat'
    }
  })

setTimeout(() => me.set({
  'k-data': {
    just: 'Doloro',
    my: 'Sit',
    name: 'Amet'
  }
}), 2000)