var Keet = require('../../')

module.exports = function(t) {
  var app = new Keet
  app.link('app', 'Hello World')
  var hello = document.getElementById('app').firstChild.nodeValue
  var expected = 'Hello World'
  t.ok(hello === expected, 'hello world')

}