const tmpl = { 
	template: '{{click}}',
	click: {
		tag: 'button',
		id: 'clicker',
		'k-click': 'clicker()',
		template: 'click me!'
	}
}

const app = new Keet

tmpl.clicker = evt => console.log(evt)

app.link('app', tmpl)
