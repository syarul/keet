var Keet = require('../../')

module.exports = function(t) {
  var keet = new Keet

  var app = {
  	template: 'Hello World'
  }

  keet.link('app', app)
  var hello = document.getElementById('app').firstChild.nodeValue
  var expected = 'Hello World'
  t.ok(hello === expected, 'Hello World')

}