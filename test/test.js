var test = require('tape')

var keet = require('../')

var closureTest = require('./fixture/closure')

var log = console.log.bind(console)

var tt = test('Keet.js Test', function (t) {

	var vDom = document.createElement('div')
	vDom.setAttribute('id', 'app')
	document.body.appendChild(vDom)

	var app = new keet
	app.link('app', 'Hello World')

    t.plan(2)
    
    var hello = document.getElementById('app').firstChild.nodeValue
    var expected = 'Hello World'
    t.ok(hello === expected, 'should equal "'+expected+'" as node value')

    /////////////////// test plan 2 /////////////////////

    document.getElementById('app').innerHTML = ''

    var closureInit = new closureTest

    closureInit.app.compose(true, function(c){
    	if(c.hasChildNodes() && c.childNodes[0].nodeType === 1){
    		var ctext = 'a view constructed in a closure'
    		t.ok(c.childNodes[0].firstChild.nodeValue === ctext, 'should equal "'+ctext+'" as node value')
    	} else {
    		t.ok(false, 'should equal "'+ctext+'" as node value')
    	}
    })

})
