const log = console.log.bind(console)

const app = new Keet

app.link('app', '{{loaded}}')

const loaded = new Keet

loaded.template('div', 'isLoaded')
	.set('a loaded content')
	.vDomLoaded = () => {
		let v = document.getElementById('isLoaded')
		log(v)
	}

app.compose()
