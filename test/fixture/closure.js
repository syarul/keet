var Keet = require('../../')

module.exports = function () {

	var ctx = this
	
	var keet = function() {
		return new Keet(ctx)
	}

	this.app = keet().link('app', '{{state}}')

	this.state = keet().template('div').set('a view constructed in a closure')

}