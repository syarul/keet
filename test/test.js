var test = require('tape')

var keet = require('../')

var log = console.log.bind(console)

var tt = test('Keet.js Test', function (t) {

	var vDom = document.createElement('div')
	vDom.setAttribute('id', 'app')
	document.body.appendChild(vDom)

	var app = new keet
	app.link('app', 'Hello World')

    t.plan(1)
    
    setTimeout(function () {

        var hello = document.getElementById('app').firstChild.nodeValue
        var expected = 'Hello World!'
        t.ok(hello === expected, 'should equal "'+expected+'" as node value')

    }, 100)
})
