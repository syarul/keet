// // using pre generated templating with element tagName 'div'
const keet = debugOff => debugOff ? new Keet('div', false) : new Keet('div', 'debug')
const tag = keet().tag

const app = keet()

app.link('app', '{{container}}')

const container = keet().register('app').set({
	value: 'some pre gen element bold with {{clr}}',
	'css-font-weight': 'bold'
})

const clr = keet()
	.register('container')
	.set({
		value: tag('a', 'link', {id: 'imgLink', href: 'http://somelink.com'}, {color: 'blue'}),
		'css-background': 'magenta'
	})


