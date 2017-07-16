var keet = new Keet


var app = { template: '{{hello}}{{info}}' }

keet.link('app', app)

var hello = {
	tag: 'input',
	id: 'testCheck',
	'k-bind': function(ev){
		info.value = ev.target.value
	}
}

var info = {
	tag: 'span',
	value: '',
}

keet.compose(app)
