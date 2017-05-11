const log = console.log.bind(console)

const app = new Keet

app.link('app', '{{loaded}}')

const loaded = new Keet

const fn = () => log('abcd')

loaded.template('div', 'isLoaded')
	.set('a loaded content')
	.vDomLoaded(fn)

app.compose()
