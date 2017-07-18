var app = new Keet

var c = { 
	template: '{{hello}}{{info}}',
	hello: {
	tag: 'input',
		'k-bind'(ev){
			this.info.template = ev.target.value
		}
	},
	info: {
		tag: 'span',
		template: ''
	}
}

app.link('app', c)
