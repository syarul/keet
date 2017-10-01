// accessing closure variable

function init() {
	
	this.keet = () => new Keet(this, 'debug') // pass context this as argument to Keet constructor

	this.app = this.keet().link('app', '{{state}}')

	this.state = this.keet()/*.register('app')*/.template('div').set('a view constructed in a closure')
	
	this.app.compose()

}

let closed = new init()

