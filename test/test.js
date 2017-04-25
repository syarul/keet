var test = require('tape')

var keet = require('../')

// var log = console.log.bind(console)

test('Hello World test', function (t) {

	var vDom = document.createElement('div')
	vDom.setAttribute('id', 'app')
	document.body.appendChild(vDom)

	var app = new keet
	app.link('app', 'Hello World')

    t.plan(1)
    
    setTimeout(function () {

        var hello = document.getElementById('app').firstChild.nodeValue
        t.equal(hello, 'Hello World!')

    }, 100)
})