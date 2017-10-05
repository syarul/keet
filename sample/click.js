const tmpl = { 
	template: '{{click}}',
	click: {
		tag: 'button',
		id: 'clicker',
		'k-click': 'clicker()',
		'k-mouseout': 'mouseout()',
		template: 'click me!'
	}
}

const app = new Keet

tmpl.clicker = evt => console.log(evt)

tmpl.mouseout = evt => console.log(evt)

app.link('app', tmpl)
