const keet = ctx => new Keet(ctx)

const tmpl = { 
	template: '{{hello}}',
	hello: {
		tag: 'div',
		id: 'hello',
		template: 'hello world'
	}
}

keet(tmpl).link('app')
