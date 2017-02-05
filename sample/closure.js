// accessing closure variable

function init() {
	
	this.keet = () => new Keet(null, 'debug', this) // pass context this as 3rd arg to Keet constructor

	this.app = this.keet().link('app', '{{state}}')

	this.state = this.keet()/*.register('app')*/.template('div').set('a view constructed in a closure')
	
	this.app.compose()

}

let closed = new init()

