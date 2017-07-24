var app = new Keet

var c = { 
	template: '{{hello}}{{info}}{{dod}}',
	hello: {
		tag: 'input',
		bind(ev){
			this.info.template = ev.target.value
		}
	},
	info: {
		tag: 'span',
		template: ''
	},
	dod: {
		tag: 'div',
		id: 'newt'
	}
}

app.link('app', c)


var napp = new Keet

var cc = {
	template: 'so yes!'
}

napp.link('newt', cc)
