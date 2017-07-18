var Keet = require('../../')

module.exports = function(t) {
  var app = new Keet

  var c = {
  	template: 'Hello World'
  }

  app.link('app', c)
  var hello = document.getElementById('app').firstChild.nodeValue
  var expected = 'Hello World'
  t.ok(hello === expected, 'Hello World')

}