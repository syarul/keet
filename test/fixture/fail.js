var test = require('tape')

var keet = require('../../')

var log = console.log.bind(console)

test('fail', function (t) {

	var vDom = document.createElement('div')
	vDom.setAttribute('id', 'app')
	document.body.appendChild(vDom)

	var app = new keet
	app.link('app', 'Hello World')

    t.plan(1)
    
    var hello = document.getElementById('app').firstChild.nodeValue
    var expected = 'Hello World!'
    t.ok(hello === expected)

});